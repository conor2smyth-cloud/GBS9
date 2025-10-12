import os
import subprocess
import sys

def run_cmd(command):
    """Helper to run shell commands and stream output"""
    try:
        subprocess.run(command, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {command}")
        sys.exit(1)

def main():
    print("🔄 Running generate_json.py ...")
    run_cmd("python generate_json.py")

    print("📂 Staging changes ...")
    run_cmd("git add .")

    print("📝 Committing ...")
    run_cmd('git commit -m "Automated update via update_site.py"')

    print("🚀 Pushing to GitHub ...")
    run_cmd("git push origin main")

    print("✅ Update complete! Your site should redeploy shortly.")

if __name__ == "__main__":
    main()
