import subprocess
import datetime

def run_cmd(cmd):
    """Run a shell command and stream its output."""
    print(f"\n💻 Running: {cmd}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"⚠️ Command failed: {cmd}")
        exit(1)

def main():
    # 1. Run image processing
    print("\n🔧 Step 1: Processing images...")
    run_cmd("python process_images.py")

    # 2. Stage all changes
    print("\n📂 Step 2: Staging changes...")
    run_cmd("git add .")

    # 3. Commit with timestamp
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Auto update: images + JSON refreshed at {now}"
    print("\n📝 Step 3: Committing changes...")
    run_cmd(f'git commit -m "{commit_message}"')

    # 4. Push to GitHub
    print("\n🚀 Step 4: Pushing to GitHub...")
    run_cmd("git push origin main")

    print("\n✅ All done! Your site should rebuild shortly on GitHub Pages.")

if __name__ == "__main__":
    main()
