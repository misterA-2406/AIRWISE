import logging
import sys
from datetime import datetime

class StructuredFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "name": record.name,
            "message": record.getMessage()
        }
        if hasattr(record, "request_id"):
            log_entry["request_id"] = record.request_id
        if hasattr(record, "provider"):
            log_entry["provider"] = record.provider
        if hasattr(record, "latency_ms"):
            log_entry["latency_ms"] = record.latency_ms
            
        return f"[{log_entry['timestamp']}] [{log_entry['level']}] {record.name}: {log_entry['message']}"

def setup_logging():
    logger = logging.getLogger("airwise")
    logger.setLevel(logging.INFO)
    
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredFormatter())
    
    if not logger.handlers:
        logger.addHandler(handler)
        
    return logger

logger = setup_logging()
