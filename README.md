# Photo Opp Interactive Experience

## Environment Variables Configuration

### Backend (`/backend/.env`)
Create a `.env` file in the `backend` folder with the following keys:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/photo-opp
JWT_SECRET=super_secret_key_123!
FRONTEND_URL=http://localhost:5173
```
*Note: Make sure your local MongoDB instance is running, or replace `MONGODB_URI` with your MongoDB Atlas connection string.*

### Frontend (`/frontend/.env`)
Create a `.env` file in the `frontend` folder (optional if you stick to defaults locally):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Instructions to Run Locally

### 1. Start the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (already done if you followed my automated setup):
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

### 2. Seed Initial Users
To access the system, you must create the initial Admin and Promotor users. With the backend running, run this cURL logic or manually open the route:
```bash
curl -X POST http://localhost:5000/api/seed
```
*This creates the following users:*
- **Admin**: `admin@nex.lab` / `admin123`
- **Promotor**: `promo@nex.lab` / `promo123`

### 3. Start the Frontend
1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start Vite:
   ```bash
   npm run dev
   ```
3. Open your browser and go to `http://localhost:5173`. 
4. Login using the credentials above to explore both flows.

---

## Deployment Steps

### Backend Deployment (Render / Railway)
1. Commit your code to a GitHub repository.
2. Sign in to Render or Railway and create a **Web Service**.
3. Point it to your GitHub repository and specify the `backend` directory as the root.
4. Set the Build Command: `npm install`
5. Set the Start Command: `node src/index.js`
6. Add the Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` pointing to your Vercel app).
7. Deploy.

### Storage Considerations (Firebase Storage/S3)
The current solution saves photos to the local `./public/photos` disk of the server. For ephemeral servers like Render/Railway, local files are deleted on restart. 
**Recommended adjustment before production**: Update `src/services/imageService.js` to upload the `sharp` generated buffer directly to an S3 bucket or Firebase Storage instead of `toFile(outputPath)`.

### Frontend Deployment (Vercel)
1. Log in to Vercel and **Add New Project**.
2. Select your repository.
3. Edit the Root Directory to specify `/frontend`.
4. The framework preset should correctly auto-detect **Vite**.
5. Add the `VITE_API_URL` environment variable pointing to your deployed backend.
6. Click **Deploy**.

---

## Extracted Features Implemented:
- **Mobile First React/Tailwind frontend** with fullscreen tap-to-start flow.
- **Camera Capture API integration** retaining the central 9:16 aspect ratio regardless of physical device size.
- **Express Backend with Sharp integration** capable of layering branding borders logically.
- **RBAC Authentication** separating the Promotor device interface from the Admin dashboard.
- **Comprehensive Logging** capturing all actions via custom Express middleware, intercepting and hashing passwords naturally.
