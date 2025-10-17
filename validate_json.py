import json
import os
from jsonschema import Draft7Validator

# Paths
SCHEMA_FILE = "data/schema.json"
JSON_FILE = "data/drinks.json"

def validate_json():
    # Load schema
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema = json.load(f)

    # Load JSON data
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Validate
    validator = Draft7Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda e: e.path)

    if errors:
        print("x Validation failed with the following issues:\n")
        for err in errors:
            # Path shows where in the JSON the error happened
            path = " -> ".join([str(p) for p in err.path]) if err.path else "root"
            print(f" - At {path}: {err.message}")
        exit(1)
    else:
        print(f"[OK] {JSON_FILE} is valid against {SCHEMA_FILE}")

if __name__ == "__main__":
    validate_json()
