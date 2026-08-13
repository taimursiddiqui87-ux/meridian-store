# Deploying ZAMIRA to hoster.pk (cPanel Node.js)

Everything below is done in cPanel. Total time: about 20 minutes the first time.

The file you upload is **`zamirastore-deploy.tar.gz`** (47 MB). It contains the
whole site already built — you never run a build on the server.

---

## Before you start

**Do not change the A record.** Because the site will run on hoster.pk, DNS must
stay pointing where it already does (`64.31.43.58`). Only the three **Resend**
records are still needed, for email.

---

## Step 1 — Create the folder

1. cPanel → **File Manager**
2. Go to the **home directory** (`/home/yourusername`) — **not** `public_html`.
   Keeping the app outside `public_html` means nobody can browse your files.
3. Click **+ Folder**, name it `zamirastore`, Create.

---

## Step 2 — Upload the bundle

1. Double-click into `zamirastore`
2. Click **Upload** (top toolbar)
3. Select `zamirastore-deploy.tar.gz` and wait for 100%.
   47 MB — a few minutes on a normal connection.
4. Click **Go Back to /home/yourusername/zamirastore**

---

## Step 3 — Extract

1. Right-click `zamirastore-deploy.tar.gz` → **Extract**
2. Confirm the path is `/home/yourusername/zamirastore` → **Extract Files**
3. Close the results box and press **Reload**

You should now see, directly inside `zamirastore`:

```
.next/          node_modules/      public/
server.js       package.json
```

If instead you see one folder called `deploy`, open it, select everything, and
move it up one level — the files must sit directly in `zamirastore`.

4. Delete `zamirastore-deploy.tar.gz` to free space (optional).

---

## Step 4 — Create the Node.js application

cPanel → **Setup Node.js App** → **CREATE APPLICATION**

| Field | Value |
|---|---|
| Node.js version | **22.23.2** |
| Application mode | **Production** |
| Application root | `zamirastore` |
| Application URL | `zamirastore.com` — leave the second box **empty** |
| Application startup file | `server.js` |

> **Application mode must be Production.** Development mode makes the site slow
> and shows internal error details to customers.

Do **not** click **CREATE** yet — add the variables first.

---

## Step 5 — Add the environment variables

Still on the same screen, under **Environment variables**, click **ADD VARIABLE**
once per row below. Copy each value from the `.env` file in your project folder
on your PC (open it with Notepad).

| Name | Where the value comes from |
|---|---|
| `DATABASE_URL` | from `.env` |
| `DIRECT_URL` | from `.env` |
| `AUTH_SECRET` | from `.env` |
| `RESEND_API_KEY` | from `.env` |
| `EMAIL_FROM` | from `.env` |
| `ADMIN_EMAIL` | `Teamzamira@gmail.com` |
| `ADMIN_USERNAME` | from `.env` |
| `ADMIN_PASSWORD` | from `.env` |
| `NEXT_PUBLIC_APP_URL` | `https://zamirastore.com` |
| `BLOB_READ_WRITE_TOKEN` | from **`.env.local`** — a different file! |

Copy values exactly — no extra spaces, no surrounding quotes.

> `BLOB_READ_WRITE_TOKEN` lives in `.env.local`, not `.env`. Without it the
> store runs fine but **uploading product photos in the admin fails**.

Now click **CREATE**.

---

## Step 6 — Start it

1. The app appears under **WEB APPLICATIONS**
2. Click **RESTART**
3. Open **https://zamirastore.com**

---

## Important: never click "Run NPM Install"

The bundle already contains everything it needs. That button would strip the
installed packages out and break the site. If you ever click it by accident,
re-upload and re-extract the bundle.

---

## If the site does not load

cPanel → Setup Node.js App → your app → open the **log file** link, and send me
the last 20 lines. Common causes:

| Symptom | Cause |
|---|---|
| "Cannot find module './server.js'" | Files are nested in a `deploy` folder — see Step 3 |
| Blank page / 503 | Wrong Node version — must be 22.x |
| Loads but products missing, admin login fails | `DATABASE_URL` missing or mistyped |
| "query engine not found" | Bundle uploaded from an older build — ask me for a fresh one |

---

## Where your data lives

Uploading the site does **not** upload your products or orders. Nothing in the
bundle contains store data — it is only the program.

| What | Stored where | Notes |
|---|---|---|
| Products, orders, customers, banners, discount codes, all Settings | **Neon** cloud Postgres database (AWS, US East) | Reached over the internet using `DATABASE_URL` |
| Product photos and videos | **Vercel Blob** storage | The database stores only the image URL |
| The website program itself | hoster.pk | This is the only part you upload |

Consequences worth knowing:

- **Re-uploading the bundle never deletes data.** You can redeploy as often as
  you like; products and orders are untouched.
- **Both copies of the site share one database.** The Vercel address and
  zamirastore.com read and write the same products and orders.
- **Adding a product in the admin writes to Neon immediately** — no upload needed.

---

## Updating the site later

Every change follows the same loop:

1. I run `npm run build:cpanel` and send you a new `zamirastore-deploy.tar.gz`
2. File Manager → `zamirastore` → **delete** `.next`, `server.js`, `node_modules`, `public`
3. Upload and extract the new archive
4. Setup Node.js App → **RESTART**

Environment variables stay — you only set those once.
