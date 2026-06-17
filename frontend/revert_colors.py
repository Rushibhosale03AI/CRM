import os
import re

directory = 'src'

replacements = {
    r'var\(--bg-primary\)': '#f4f7f6',
    r'var\(--bg-card\)': '#ffffff',
    r'var\(--text-primary\)': '#1e293b',
    r'var\(--text-secondary\)': '#64748b',
    r'var\(--text-light\)': '#94a3b8',
    r'var\(--border-color\)': '#e2e8f0',
    r'var\(--border-light\)': '#cbd5e1',
    r'var\(--accent-blue\)': '#3b82f6',
    r'var\(--bg-hover\)': '#f8fafc',
    r'var\(--bg-blue-light\)': '#eff6ff'
}

def revert_colors():
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                for var_name, hex_code in replacements.items():
                    content = re.sub(var_name, hex_code, content)
                
                if content != original_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Reverted {path}")
                    count += 1
    
    print(f"Total files reverted: {count}")

if __name__ == '__main__':
    revert_colors()
