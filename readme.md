jwt secret || mongo uri -> .env

.env 
 ```
    MONGO_URI=mongodb+srv://admin:admin123@cluster.thr7t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster
    JWT_SECRET=your-secure-secret-key
```

/frontend: Frontend ile ilgili tüm dosyalar burada. Vite, React, vb. konfigürasyonlar burada yer alır.
/backend: Backend projesi burada (örneğin NestJS veya Express).
/shared: Frontend ve backend arasında ortak kullanılacak utils, types, hooks, api gibi bileşenler. Bu klasör, her iki taraf arasında paylaşılan kodu içerir.
/common: Projeye özel konfigürasyonlar, genel bağımlılıklar, global stil dosyaları vb. içerir.
