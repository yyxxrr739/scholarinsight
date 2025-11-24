#!/bin/bash

# ScholarInsight ECS部署脚本
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

# 配置信息
SSH_KEY="~/.ssh/key_scholarinsight.pem"
SERVER_USER="root"
SERVER_IP="118.31.238.102"
DEPLOY_PATH="/usr/share/nginx/html"
PROJECT_DIR=$(pwd)

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查SSH密钥
check_ssh_key() {
    echo_info "检查SSH密钥..."
    SSH_KEY_PATH="${SSH_KEY/#\~/$HOME}"
    if [ ! -f "$SSH_KEY_PATH" ]; then
        echo_error "SSH密钥文件不存在: $SSH_KEY_PATH"
        exit 1
    fi
    chmod 600 "$SSH_KEY_PATH"
    echo_info "SSH密钥检查通过"
}

# 检查Node.js环境
check_node() {
    echo_info "检查Node.js环境..."
    if ! command -v node &> /dev/null; then
        echo_error "Node.js未安装，请先安装Node.js 18+"
        exit 1
    fi
    NODE_VERSION=$(node -v)
    echo_info "Node.js版本: $NODE_VERSION"
}

# 构建项目
build_project() {
    echo_info "开始构建项目..."
    
    # 检查package.json
    if [ ! -f "package.json" ]; then
        echo_error "未找到package.json，请确保在项目根目录执行脚本"
        exit 1
    fi
    
    # 安装依赖（如果需要）
    if [ ! -d "node_modules" ]; then
        echo_info "安装依赖..."
        npm install
    fi
    
    # 清理旧构建
    echo_info "清理旧构建文件..."
    rm -rf .next out
    
    # 构建
    echo_info "执行构建..."
    npm run build
    
    # 检查构建结果
    if [ ! -d "out" ]; then
        echo_error "构建失败，未找到out目录"
        exit 1
    fi
    
    echo_info "构建完成"
}

# 备份服务器文件
backup_server() {
    echo_info "备份服务器现有文件..."
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no \
        "$SERVER_USER@$SERVER_IP" \
        "if [ -d '$DEPLOY_PATH' ] && [ \"\$(ls -A $DEPLOY_PATH)\" ]; then
            BACKUP_DIR=\"$DEPLOY_PATH.backup.\$(date +%Y%m%d_%H%M%S)\"
            mv $DEPLOY_PATH \"\$BACKUP_DIR\"
            echo \"备份完成: \$BACKUP_DIR\"
        fi
        mkdir -p $DEPLOY_PATH"
}

# 上传文件
upload_files() {
    echo_info "上传文件到服务器..."
    
    # 上传out目录
    echo_info "上传out目录..."
    rsync -avz --delete \
        -e "ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no" \
        ./out/ \
        "$SERVER_USER@$SERVER_IP:$DEPLOY_PATH/"
    
    # 上传public目录（如果存在且需要）
    if [ -d "public" ] && [ "$(ls -A public)" ]; then
        echo_info "上传public目录..."
        rsync -avz \
            -e "ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no" \
            ./public/ \
            "$SERVER_USER@$SERVER_IP:$DEPLOY_PATH/"
    fi
    
    echo_info "文件上传完成"
}

# 设置文件权限
set_permissions() {
    echo_info "设置文件权限..."
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no \
        "$SERVER_USER@$SERVER_IP" \
        "chown -R nginx:nginx $DEPLOY_PATH && \
         chmod -R 755 $DEPLOY_PATH"
}

# 重载Nginx
reload_nginx() {
    echo_info "重载Nginx配置..."
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no \
        "$SERVER_USER@$SERVER_IP" \
        "nginx -t && systemctl reload nginx" || {
        echo_warn "Nginx重载失败，请手动检查"
    }
}

# 验证部署
verify_deployment() {
    echo_info "验证部署..."
    echo_info "检查服务器文件..."
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no \
        "$SERVER_USER@$SERVER_IP" \
        "ls -la $DEPLOY_PATH | head -10"
    
    echo_info "检查Nginx状态..."
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no \
        "$SERVER_USER@$SERVER_IP" \
        "systemctl status nginx --no-pager | head -5"
    
    echo_info "部署验证完成"
    echo_info "请访问 http://$SERVER_IP 检查网站是否正常"
}

# 主函数
main() {
    echo_info "========================================="
    echo_info "ScholarInsight ECS部署脚本"
    echo_info "========================================="
    echo ""
    
    check_ssh_key
    check_node
    build_project
    backup_server
    upload_files
    set_permissions
    reload_nginx
    verify_deployment
    
    echo ""
    echo_info "========================================="
    echo_info "部署完成！"
    echo_info "========================================="
    echo_info "服务器IP: $SERVER_IP"
    echo_info "部署路径: $DEPLOY_PATH"
    echo_warn "请确保已配置域名DNS和Nginx配置文件"
    echo_info "详细说明请参考 ECS_DEPLOYMENT.md"
}

# 执行主函数
main

