import json
import sys
from jsonschema import validate, ValidationError

SCHEMA_FILE = "schema.json"
DATA_FILE = "data/drinks.json"

def validate_json():
    try:
        with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
            schema = json.load(f)
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        validate(instance=data, schema=schema)
        print(f"[OK] {DATA_FILE} is valid against {SCHEMA_FILE}")

    except ValidationError as e:
        print("x Validation failed:", e.message)
        sys.exit(1)
    except Exception as e:
        print("x Error:", e)
        sys.exit(1)

if __name__ == "__main__":
    validate_json()
