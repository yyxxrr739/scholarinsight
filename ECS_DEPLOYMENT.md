# ScholarInsight 阿里云ECS部署文档

## 📋 部署概览

本文档详细说明如何将ScholarInsight网站部署到阿里云ECS服务器。

### 服务器信息
- **服务器IP**: `118.31.238.102`
- **SSH用户**: `root`
- **SSH密钥**: `~/.ssh/key_scholarinsight.pem`
- **部署路径**: `/usr/share/nginx/html/`
- **Web服务器**: Nginx

### 部署架构
```
本地开发环境 → 构建静态文件 → 上传到ECS → Nginx服务
```

---

## 🔍 前置检查清单

在开始部署前，请确认以下事项：

- [x] ECS服务器已购买并运行中
- [x] 域名已购买并完成ICP备案
- [x] SSH密钥文件存在：`~/.ssh/key_scholarinsight.pem`
- [x] 本地项目代码已更新到最新版本
- [x] 本地已安装Node.js 18+和npm

---

## 📦 部署步骤

### 第一步：本地构建项目

在本地项目目录执行以下命令：

```bash
# 1. 确保依赖已安装
npm install

# 2. 清理旧的构建文件（可选）
rm -rf .next out

# 3. 构建静态文件
npm run build

# 4. 验证构建结果
ls -la out/
```

**预期结果**：
- `out/` 目录应包含所有静态HTML文件
- `out/_next/` 目录应包含所有静态资源（CSS、JS等）

### 第二步：准备部署文件

构建完成后，需要上传以下内容到服务器：

1. **`out/` 目录** - 静态网站文件
2. **`public/` 目录** - 静态资源（图片、报告等）

### 第三步：连接服务器并检查环境

```bash
# 测试SSH连接
ssh -i ~/.ssh/key_scholarinsight.pem root@118.31.238.102

# 检查Nginx是否安装
nginx -v

# 检查Nginx服务状态
systemctl status nginx

# 检查部署目录权限
ls -la /usr/share/nginx/html/
```

**如果Nginx未安装**，执行：
```bash
# CentOS/RHEL
yum install -y nginx

# Ubuntu/Debian
apt-get update && apt-get install -y nginx
```

### 第四步：备份现有网站（如果存在）

```bash
# SSH连接到服务器
ssh -i ~/.ssh/key_scholarinsight.pem root@118.31.238.102

# 备份现有网站（如果存在）
if [ -d "/usr/share/nginx/html" ]; then
    mv /usr/share/nginx/html /usr/share/nginx/html.backup.$(date +%Y%m%d_%H%M%S)
fi

# 创建新的部署目录
mkdir -p /usr/share/nginx/html
```

### 第五步：上传文件到服务器

**方法一：使用scp命令（推荐）**

在本地项目根目录执行：

```bash
# 上传out目录内容
scp -r -i ~/.ssh/key_scholarinsight.pem ./out/* root@118.31.238.102:/usr/share/nginx/html/

# 上传public目录（如果需要）
scp -r -i ~/.ssh/key_scholarinsight.pem ./public/* root@118.31.238.102:/usr/share/nginx/html/
```

**方法二：使用rsync（更高效，支持增量同步）**

```bash
# 上传out目录
rsync -avz -e "ssh -i ~/.ssh/key_scholarinsight.pem" \
  ./out/ root@118.31.238.102:/usr/share/nginx/html/

# 上传public目录
rsync -avz -e "ssh -i ~/.ssh/key_scholarinsight.pem" \
  ./public/ root@118.31.238.102:/usr/share/nginx/html/
```

### 第六步：配置Nginx

SSH连接到服务器，创建或编辑Nginx配置文件：

```bash
ssh -i ~/.ssh/key_scholarinsight.pem root@118.31.238.102
```

创建配置文件 `/etc/nginx/conf.d/scholarinsight.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # 替换为你的域名
    
    root /usr/share/nginx/html;
    index index.html;
    
    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Next.js静态文件
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # HTML文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }
    
    # 处理Next.js路由
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }
    
    # 404错误处理
    error_page 404 /404.html;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**重要**：将 `your-domain.com` 替换为你的实际域名。

### 第七步：配置域名DNS

在域名DNS管理面板添加以下记录：

```
类型: A
主机记录: @
记录值: 118.31.238.102
TTL: 600

类型: A
主机记录: www
记录值: 118.31.238.102
TTL: 600
```

### 第八步：测试和启动Nginx

```bash
# 测试Nginx配置
nginx -t

# 如果测试通过，重载Nginx配置
systemctl reload nginx

# 或者重启Nginx
systemctl restart nginx

# 设置Nginx开机自启
systemctl enable nginx

# 检查Nginx状态
systemctl status nginx
```

### 第九步：配置防火墙（如果需要）

```bash
# 检查防火墙状态
firewall-cmd --state  # CentOS/RHEL
# 或
ufw status  # Ubuntu/Debian

# 开放80和443端口（CentOS/RHEL）
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 开放80和443端口（Ubuntu/Debian）
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
```

### 第十步：验证部署

1. **检查文件是否上传成功**：
```bash
ssh -i ~/.ssh/key_scholarinsight.pem root@118.31.238.102
ls -la /usr/share/nginx/html/
```

2. **检查Nginx日志**：
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

3. **访问测试**：
   - 通过IP访问：`http://118.31.238.102`
   - 通过域名访问：`http://your-domain.com`
   - 检查所有页面是否正常加载
   - 检查静态资源（CSS、JS、图片）是否正常加载

---

## 🔒 SSL证书配置（HTTPS，可选但推荐）

### 使用Let's Encrypt免费证书

```bash
# 安装certbot
# CentOS/RHEL
yum install -y certbot python3-certbot-nginx

# Ubuntu/Debian
apt-get install -y certbot python3-certbot-nginx

# 获取证书（自动配置Nginx）
certbot --nginx -d your-domain.com -d www.your-domain.com

# 测试自动续期
certbot renew --dry-run
```

证书配置后，Nginx会自动更新配置支持HTTPS。

---

## 🔄 更新部署流程

当需要更新网站时，执行以下步骤：

```bash
# 1. 本地构建
npm run build

# 2. 备份服务器上的旧文件（可选）
ssh -i ~/.ssh/key_scholarinsight.pem root@118.31.238.102 \
  "cp -r /usr/share/nginx/html /usr/share/nginx/html.backup.$(date +%Y%m%d_%H%M%S)"

# 3. 上传新文件
rsync -avz --delete -e "ssh -i ~/.ssh/key_scholarinsight.pem" \
  ./out/ root@118.31.238.102:/usr/share/nginx/html/

# 4. 重载Nginx（无需重启）
ssh -i ~/.ssh/key_scholarinsight.pem root@118.31.238.102 \
  "systemctl reload nginx"
```

---

## 🚨 故障排除

### 问题1：无法SSH连接

**检查项**：
- SSH密钥文件权限：`chmod 600 ~/.ssh/key_scholarinsight.pem`
- ECS安全组是否开放22端口
- 服务器IP是否正确

### 问题2：Nginx无法启动

**检查项**：
```bash
# 查看Nginx错误日志
tail -50 /var/log/nginx/error.log

# 测试配置文件
nginx -t

# 检查端口占用
netstat -tlnp | grep :80
```

### 问题3：网站无法访问

**检查项**：
- Nginx服务是否运行：`systemctl status nginx`
- 防火墙是否开放80端口
- DNS解析是否正确：`nslookup your-domain.com`
- 文件权限是否正确：`chmod -R 755 /usr/share/nginx/html`

### 问题4：静态资源404

**检查项**：
- 确认`out/_next/`目录已上传
- 检查Nginx配置中的静态资源路径
- 查看浏览器控制台错误信息

### 问题5：页面路由404

**检查项**：
- 确认Nginx配置中有 `try_files` 指令
- 检查`out/`目录结构是否正确

---

## 📊 性能优化建议

1. **启用Gzip压缩**（已在Nginx配置中包含）
2. **配置CDN**：将静态资源（图片、CSS、JS）通过CDN加速
3. **图片优化**：压缩图片，使用WebP格式
4. **浏览器缓存**：已配置静态资源长期缓存

---

## 🔐 安全建议

1. **定期更新系统**：
```bash
# CentOS/RHEL
yum update -y

# Ubuntu/Debian
apt-get update && apt-get upgrade -y
```

2. **配置SSH密钥登录**（禁用密码登录）
3. **定期备份网站文件**
4. **监控服务器资源使用情况**
5. **配置HTTPS**（使用Let's Encrypt）

---

## 📝 部署检查清单

部署完成后，请确认：

- [ ] 网站可以通过IP访问
- [ ] 网站可以通过域名访问
- [ ] 所有页面正常加载
- [ ] 静态资源（CSS、JS、图片）正常加载
- [ ] 报告页面可以正常打开
- [ ] 学者详情页可以正常打开
- [ ] 网络图可以正常显示
- [ ] 移动端访问正常
- [ ] Nginx日志无错误
- [ ] SSL证书已配置（如需要）

---

## 📞 支持

如遇到部署问题，请检查：
1. Nginx错误日志：`/var/log/nginx/error.log`
2. 系统日志：`journalctl -u nginx`
3. 服务器资源：`top`、`df -h`、`free -m`

---

## 📅 部署记录

| 日期 | 版本 | 操作人 | 备注 |
|------|------|--------|------|
| - | - | - | 初始部署 |

---

**注意**：本文档中的域名 `your-domain.com` 需要替换为你的实际域名。

