import os
import re

directory = 'src'

replacements = {
    r'#f4f7f6': 'var(--bg-primary)',
    r'#ffffff': 'var(--bg-card)',
    r'#1e293b': 'var(--text-primary)',
    r'#64748b': 'var(--text-secondary)',
    r'#94a3b8': 'var(--text-light)',
    r'#e2e8f0': 'var(--border-color)',
    r'#cbd5e1': 'var(--border-light)',
    r'#3b82f6': 'var(--accent-blue)',
    r'#f8fafc': 'var(--bg-hover)',
    r'#eff6ff': 'var(--bg-blue-light)'
}

def convert_colors():
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                for hex_code, var_name in replacements.items():
                    # Use re.sub with IGNORECASE to catch uppercase hex codes too
                    content = re.sub(hex_code, var_name, content, flags=re.IGNORECASE)
                
                if content != original_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {path}")
                    count += 1
    
    print(f"Total files updated: {count}")

if __name__ == '__main__':
    convert_colors()
