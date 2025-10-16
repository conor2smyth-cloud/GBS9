import subprocess
import sys

# Run a shell command and capture output
def run_command(cmd, stop_on_error=True):
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True, shell=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Command failed: {cmd}")
        print("DETAILS:\n", e.stderr.strip())
        if stop_on_error:
            sys.exit(1)
        return None


def main():
    print("🔄 Step 1: Importing Excel → JSON ...")
    if run_command("python import_excel.py", stop_on_error=False) is None:
        print("[ERROR] Failed to convert Excel into JSON. Check formatting.")
        sys.exit(1)
    print("[OK] Exported Excel → data/drinks.json")

    print("\n🔍 Step 2: Validating JSON ...")
    if run_command("python validate_json.py", stop_on_error=False) is None:
        print("[ERROR] Validation failed. Fix JSON before proceeding.")
        sys.exit(1)
    print("[OK] data/drinks.json is valid against schema.json")

    print("\n⬆️ Step 3: Committing & pushing to GitHub ...")

    # Stage and commit changes
    run_command("git add .")
    run_command('git commit -m "Auto-update drinks.json" || echo "No changes to commit"', stop_on_error=False)

    # Try normal push
    push_result = run_command("git push", stop_on_error=False)

    if push_result is None:  # Push failed, try upstream fix
        print("\n⚠️  Git push failed. Trying to set upstream automatically...")
        upstream_result = run_command("git push --set-upstream origin main", stop_on_error=False)
        if upstream_result is None:
            print("\n❌ Git push failed completely. Check your GitHub connection or branch name.")
            sys.exit(1)
        else:
            print("\n✅ Git push fixed with --set-upstream origin main")
    else:
        print("\n✅ Git push successful!")

    print("\n🎉 Update complete. GitHub Pages will rebuild automatically.")


if __name__ == "__main__":
    main()
