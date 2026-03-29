# LOMAFY — Sunucu Deployment Rehberi
## Apache + PM2 ile lomafy.com Kurulumu

---

## ÖN KOŞULLAR

Sunucuda şunların kurulu olması gerekir:
- Ubuntu 20.04+ / Debian
- Node.js 20+
- npm 10+
- PM2 (global)
- Apache2
- Certbot (SSL için)

---

## ADIM 1 — Node.js ve PM2 Kurulumu

```bash
# Node.js 20.x kur
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Versiyon kontrolü
node --version   # v20.x.x
npm --version    # 10.x.x

# PM2 global kur
sudo npm install -g pm2
```

---

## ADIM 2 — Proje Dosyalarını Sunucuya Aktar

```bash
# Proje dizini oluştur
sudo mkdir -p /var/www/lomafy
sudo chown $USER:$USER /var/www/lomafy

# Git ile çek (veya dosyaları SCP/FTP ile aktar)
cd /var/www/lomafy
git clone https://github.com/KULLANICI/lomafy.git .

# Ya da dosyaları sıkıştırıp sunucuya at:
# Yerelde:  tar -czf lomafy.tar.gz --exclude=node_modules --exclude=dist .
# Sunucuda: tar -xzf lomafy.tar.gz -C /var/www/lomafy
```

---

## ADIM 3 — .env Dosyasını Oluştur

```bash
cd /var/www/lomafy
cp .env.example .env
nano .env
```

**.env içeriği şöyle olmalı** (kendi bilgilerinizle doldurun):

```env
NODE_ENV=production
PORT=3001

DATABASE_URL=postgresql://neondb_owner:npg_3fmuPxMKO6RJ@ep-steep-haze-aldtgu5h-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
NEON_DATABASE_URL=postgresql://neondb_owner:npg_3fmuPxMKO6RJ@ep-steep-haze-aldtgu5h-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require

SESSION_SECRET=lomafy_super_secret_jwt_2025_Xk9mP3qR7vN2wL8sT
```

> ⚠️ SESSION_SECRET için güçlü bir random string üretin:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## ADIM 4 — Bağımlılıkları Kur ve Projeyi Build Et

```bash
cd /var/www/lomafy

# Bağımlılıkları kur
npm install

# Production build al (frontend + backend)
npm run build
```

Build sonucunda `dist/` klasörü oluşur:
- `dist/index.cjs` → Express backend
- `dist/public/` → React frontend (static files)

---

## ADIM 5 — PM2 Ecosystem Dosyası Oluştur

> ℹ️ **Not:** Uygulama, `.env` dosyasını **otomatik olarak** yükler (`dotenv` entegre edilmiştir).
> PM2 veya sistem ortam değişkeni ayarlamanıza gerek yoktur — sadece `.env` dosyasının
> `/var/www/lomafy/.env` konumunda olması yeterlidir.

```bash
nano /var/www/lomafy/ecosystem.config.cjs
```

İçeriği:

```javascript
module.exports = {
  apps: [
    {
      name: "lomafy",
      script: "./dist/index.cjs",
      cwd: "/var/www/lomafy",
      instances: 1,
      exec_mode: "fork",
      error_file: "/var/log/pm2/lomafy-error.log",
      out_file: "/var/log/pm2/lomafy-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      restart_delay: 5000,
      max_restarts: 10,
    },
  ],
};
```

---

## ADIM 6 — PM2 ile Uygulamayı Başlat

```bash
cd /var/www/lomafy

# Log klasörü oluştur
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Uygulamayı başlat
pm2 start ecosystem.config.cjs

# Durum kontrolü
pm2 status
pm2 logs lomafy --lines 20

# Sunucu yeniden başladığında otomatik çalışması için
pm2 save
pm2 startup
# (startup komutu size bir komut verir, onu kopyalayıp çalıştırın)
```

Uygulamanın çalıştığını test edin:
```bash
curl http://localhost:3001/api/categories
# JSON dönmeli
```

---

## ADIM 7 — Apache Virtual Host Yapılandırması

```bash
# Gerekli modülleri etkinleştir
sudo a2enmod proxy proxy_http proxy_balancer lbmethod_byrequests headers rewrite ssl

# Virtual host dosyası oluştur
sudo nano /etc/apache2/sites-available/lomafy.conf
```

İçeriği:

```apacheconf
<VirtualHost *:80>
    ServerName lomafy.com
    ServerAlias www.lomafy.com

    # HTTP → HTTPS yönlendirme (SSL kurulduktan sonra)
    # Aşağıdaki satırı SSL kurulumundan ÖNCE yorum satırı olarak bırakın
    # RewriteEngine On
    # RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    ProxyPreserveHost On
    ProxyRequests Off

    ProxyPass / http://127.0.0.1:3001/
    ProxyPassReverse / http://127.0.0.1:3001/

    # WebSocket desteği
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) ws://127.0.0.1:3001/$1 [P,L]

    ErrorLog /var/log/apache2/lomafy-error.log
    CustomLog /var/log/apache2/lomafy-access.log combined
</VirtualHost>
```

```bash
# Siteyi etkinleştir
sudo a2ensite lomafy.conf
sudo a2dissite 000-default.conf  # default siteyi devre dışı bırak (opsiyonel)

# Config doğrula
sudo apache2ctl configtest

# Apache yeniden başlat
sudo systemctl reload apache2
```

---

## ADIM 8 — SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kur
sudo apt install certbot python3-certbot-apache -y

# SSL sertifikası al ve Apache'yi otomatik yapılandır
sudo certbot --apache -d lomafy.com -d www.lomafy.com

# Otomatik yenileme test et
sudo certbot renew --dry-run
```

Certbot, Apache config dosyasını otomatik olarak HTTPS için günceller.

---

## ADIM 9 — Güvenlik Duvarı Ayarları

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp   # SSH
# 3001 portunu dışarıya AÇMAYIN — sadece localhost erişimi olsun
sudo ufw enable
sudo ufw status
```

---

## YÖNETIM KOMUTLARI

```bash
# PM2 komutları
pm2 status                    # Uygulama durumu
pm2 logs lomafy               # Canlı loglar
pm2 restart lomafy            # Yeniden başlat
pm2 reload lomafy             # Sıfır kesintili reload
pm2 stop lomafy               # Durdur

# Güncelleme (yeni kod geldiğinde)
cd /var/www/lomafy
git pull origin main
npm install
npm run build
pm2 reload lomafy

# Apache komutları
sudo systemctl status apache2
sudo systemctl reload apache2
sudo apache2ctl configtest
```

---

## SORUN GİDERME

**Uygulama başlamıyorsa:**
```bash
pm2 logs lomafy --lines 50
```

**Apache 502 Bad Gateway:**
```bash
# PM2 uygulamasının çalıştığından emin olun
pm2 status
curl http://localhost:3001/api/categories
```

**Veritabanı bağlantı hatası:**
```bash
# .env dosyasındaki DATABASE_URL'yi kontrol edin
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL ? 'OK' : 'EKSIK')"
```

**Build hatası:**
```bash
# node_modules temizle ve yeniden kur
rm -rf node_modules dist
npm install
npm run build
```

---

## ÖZET KONTROL LİSTESİ

- [ ] Node.js 20+ kurulu
- [ ] PM2 global kurulu
- [ ] `/var/www/lomafy` klasörüne proje kopyalandı
- [ ] `.env` dosyası oluşturuldu ve dolduruldu
- [ ] `npm install && npm run build` çalıştırıldı
- [ ] `ecosystem.config.cjs` oluşturuldu
- [ ] PM2 ile uygulama başlatıldı (`pm2 start ecosystem.config.cjs`)
- [ ] `pm2 save && pm2 startup` çalıştırıldı
- [ ] Apache virtual host yapılandırıldı
- [ ] Apache yeniden başlatıldı
- [ ] SSL sertifikası alındı (Certbot)
- [ ] Güvenlik duvarı açıldı (80, 443)
- [ ] `https://lomafy.com` üzerinden test edildi ✅

---

**Varsayılan Giriş Bilgileri:**
- Admin: `admin@lomafy.com` / `admin123`
- Üretici örnek: `etkinsa@lomafy.com` / `uretici123`

> ⚠️ Canlıya almadan önce admin şifresini değiştirmeyi unutmayın!
