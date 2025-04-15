import redis
import json
import time
import logging
import subprocess
from typing import Dict, Any, Callable, Optional, List

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("redis_automation_trigger")


class AutomationRunner:
    def run_script(self, script_name: str) -> None:
        """Run a Python script and check its return code"""
        logger.info(f"[STEP] Running {script_name}")
        result = subprocess.run(["python3", script_name])
        if result.returncode != 0:
            logger.error(f"[ERROR] {script_name} exited with code {result.returncode}")
            raise RuntimeError(
                f"Script {script_name} failed with exit code {result.returncode}"
            )

    def run_automation_sequence(self, scripts: List[str]) -> None:
        """Run a sequence of Python scripts"""
        logger.info("[INFO] Starting automation sequence...")

        for script in scripts:
            self.run_script(script)

        logger.info("[COMPLETE] All scripts executed successfully.")


class RedisTaskProcessor:
    def __init__(
        self,
        queue_name: str,
        host: str = "redis-17106.c10.us-east-1-2.ec2.redns.redis-cloud.com",
        port: int = 17106,
        db: int = 0,
        password: str = "MxW2WS4rlheRop2gO39PIPoS3vW5sE2Z",
        username: str = "default",
    ):
        """
        Initialize Redis task processor

        Args:
            queue_name: Name of the Redis queue to consume from
            host: Redis server host
            port: Redis server port
            db: Redis database number
            password: Redis password
            username: Redis username
        """
        self.queue_name = queue_name
        self.redis_client = redis.Redis(
            host=host,
            port=port,
            db=db,
            password=password,
            username=username,
            decode_responses=True,
        )
        self.running = False
        self.automation_runner = AutomationRunner()

    def process_trigger(self, trigger: str) -> None:
        """Process a trigger string"""
        logger.info(f"Received trigger: {trigger}")

        # Define the scripts to run based on trigger
        if trigger == "run_automation1":
            scripts = [
                "main.py",
                "resume.py",
                "basic-information.py",
                "apply.py",
                "volunteer.py",
                "self-identity.py",
            ]

            try:
                self.automation_runner.run_automation_sequence(scripts)
            except Exception as e:
                logger.error(f"Automation sequence failed: {e}")
        else:
            logger.warning(f"Unknown trigger: {trigger}")

    def start(self, poll_interval: float = 1.0) -> None:
        """
        Start processing triggers from the Redis queue.

        Args:
            poll_interval: Time in seconds to wait between polling when the queue is empty.
        """
        self.running = True
        logger.info(f"Starting trigger processor for queue: {self.queue_name}")
        logger.info(
            f"Connected to Redis at {self.redis_client.connection_pool.connection_kwargs['host']}:{self.redis_client.connection_pool.connection_kwargs['port']}"
        )

        try:
            # Test connection
            self.redis_client.ping()
            logger.info("Successfully connected to Redis")

            desired_keyword = (
                "run_automation1"  # Only process tasks containing this keyword
            )

            while self.running:
                # Use BRPOP for blocking pop with timeout
                result = self.redis_client.brpop(self.queue_name, timeout=poll_interval)

                if result is None:
                    continue

                _, value = result

                try:
                    # Try to decode as JSON first
                    try:
                        data = json.loads(value)
                        # If it's a dict with a trigger field, use that as the trigger string.
                        if isinstance(data, dict) and "trigger" in data:
                            trigger = data["trigger"]
                        else:
                            # Otherwise, treat the JSON as the trigger string.
                            trigger = str(data)
                    except json.JSONDecodeError:
                        # If not JSON, treat as plain string trigger.
                        trigger = value

                    # Only process tasks whose trigger contains the desired keyword.
                    if desired_keyword not in trigger:
                        logger.info(
                            f"Skipping trigger '{trigger}' (does not contain '{desired_keyword}')"
                        )
                        continue

                    # Process the trigger as normal.
                    self.process_trigger(trigger)
                except Exception as e:
                    logger.error(f"Error processing trigger: {e}")

        except redis.exceptions.ConnectionError as e:
            logger.error(f"Redis connection error: {e}")
        except KeyboardInterrupt:
            logger.info("Shutting down trigger processor...")
        finally:
            self.running = False
            logger.info("Trigger processor stopped")

    def stop(self) -> None:
        """Stop the trigger processor"""
        self.running = False


# Example usage
if __name__ == "__main__":
    # Create and configure the trigger processor with the provided credentials
    processor = RedisTaskProcessor(
        queue_name="automation:triggers"
        # Default parameters now use the provided credentials
    )

    # Start processing triggers
    print("Waiting for automation triggers from Redis queue...")
    processor.start()
