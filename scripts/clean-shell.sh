#!/bin/bash

echo "🔧 Fixing shell configuration issues..."

# Create a clean .zshrc if it doesn't exist
if [ ! -f ~/.zshrc ]; then
    echo "Creating clean .zshrc..."
    cat > ~/.zshrc << 'EOF'
# Clean zsh configuration
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export EDITOR="nano"

# Disable problematic shell features
unsetopt PROMPT_SP
unsetopt AUTO_CD

# Basic aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

echo "✅ Clean shell configuration loaded"
EOF
fi

# Source the clean configuration
source ~/.zshrc

echo "✅ Shell configuration fixed!"
echo "🔄 Please restart your terminal or run: source ~/.zshrc"
