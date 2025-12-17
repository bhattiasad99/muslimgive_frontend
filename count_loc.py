import os
import subprocess
from pathlib import Path

def get_gitignored_paths():
    try:
        ignored = subprocess.check_output(
            ['git', 'ls-files', '--others', '-i', '--exclude-standard'],
            stderr=subprocess.DEVNULL
        ).decode().splitlines()
        return set(ignored)
    except Exception:
        return set()

def count_lines(root_path='.'):
    ignored = get_gitignored_paths()
    total_lines = 0
    excluded_dirs = {'node_modules', '.git', '.venv', '__pycache__'}

    for dirpath, dirnames, filenames in os.walk(root_path):
        dirnames[:] = [d for d in dirnames if d not in excluded_dirs and not d.startswith('.')]
        for file in filenames:
            file_path = os.path.join(dirpath, file)
            if file_path in ignored:
                continue
            if file_path.endswith(('.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.go', '.java')):
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        total_lines += sum(1 for _ in f)
                except Exception:
                    pass

    return total_lines

if __name__ == '__main__':
    root = Path('.').resolve()
    print(f"Total lines of code in {root}: {count_lines(root)}")
