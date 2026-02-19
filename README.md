# ConectaFisio360 - React + Firebase + Stripe (starter)

## Passos rápidos

1. Criar projeto no Firebase:
   - Ativar Authentication (Email/Password e Google)
   - Criar Firestore (modo produção ou em teste)
   - Configurar Realtime/Storage se precisar (opcional)
   - Gerar Service Account JSON (para webhook)

2. Criar conta no Stripe:
   - Criar produto + price (recorrente mensal) e copiar `PRICE_ID`
   - Criar webhook e pegar `STRIPE_WEBHOOK_SECRET`

3. Variáveis de ambiente (Vercel):
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
   - VITE_FIREBASE_DATABASE_URL
   - VITE_STRIPE_PRICE_ID
   - STRIPE_SECRET_KEY (server)
   - STRIPE_WEBHOOK_SECRET (server)
   - FIREBASE_SERVICE_ACCOUNT (JSON string - server)
   - NEXT_PUBLIC_BASE_URL (ex: https://seusite.vercel.app)

4. Deploy:
   - Subir repo no GitHub
   - Conectar no Vercel
   - Configurar variáveis no Vercel (envolvendo as serverless)
   - Criar endpoints `/api/create-checkout-session` e `/api/stripe-webhook`

## Observações
- Webhook precisa do Firebase Admin (service account).
- Frontend usa Firestore para ler `users/{uid}.plano` e `cursos/*`.
- Adapte o campo `curso.link` para ser embed (YouTube embed ou URL segura).
