import json
import os
from jsonschema import Draft7Validator

def validate_file(json_file, schema_file):
    with open(json_file, encoding="utf-8") as f:
        data = json.load(f)
    with open(schema_file, encoding="utf-8") as f:
        schema = json.load(f)

    validator = Draft7Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda e: e.path)

    if errors:
        print(f" x Validation failed: {json_file}")
        for err in errors:
            path = " -> ".join([str(x) for x in err.path]) or "root"
            print(f" - At {path}: {err.message}")
        return False
    else:
        print(f"[OK] {json_file} is valid against {schema_file}")
        return True

def validate_json():
    ok1 = validate_file("data/drinks.json", "schema.json")
    ok2 = validate_file("data/heroes.json", "heroes_schema.json")
    return ok1 and ok2

if __name__ == "__main__":
    if not validate_json():
        exit(1)
