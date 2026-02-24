# MediAssist - Quick Start Guide

## Installation & Setup (One-Time)

### Prerequisites
- Node.js v22+ installed
- npm installed
- Port 5000 (backend) and 3000 (frontend) available

### Initial Setup
```bash
# Backend dependencies already installed in C:\MediAssist\Backend
# Frontend dependencies already installed in C:\MediAssist\Frontend
# Just build and run!
```

---

## Running the Application

### Step 1: Start Backend Server
```powershell
cd C:\MediAssist\Backend
node server.js
```
Expected output:
```
Server running on port 5000
```

### Step 2: Start Frontend Server (New Terminal)
```powershell
cd C:\MediAssist\Frontend
npm run build
cd dist
npx http-server -p 3000 -c-1
```
Or skip build and serve pre-built:
```powershell
cd C:\MediAssist\Frontend\dist
npx http-server -p 3000 -c-1
```

### Step 3: Access Application
Open browser and navigate to:
```
http://localhost:3000
```

---

## Using the Application

### Triage Tab (Symptom Analysis)

1. **Enter Symptoms**
   - Type medical symptoms in the text area
   - Examples:
     - "chest pain and difficulty breathing"
     - "headache and mild fever"
     - "fever, body ache"

2. **Select Region** (Optional)
   - Choose your state from dropdown
   - 10 Indian states available
   - Defaults to "Unknown" if not selected

3. **Select Language**
   - English (default)
   - Hindi (हिंदी)
   - Telugu (తెలుగు)
   - UI changes instantly to selected language

4. **Submit**
   - Click "Analyze" button
   - AI processes symptoms and classifies risk level

5. **View Results**
   - **Risk Level**: HIGH (red), MEDIUM (orange), or LOW (green)
   - **Condition**: AI-identified condition name
   - **Advice**: Recommended action (seek immediate care / visit doctor / monitor)

### Dashboard Tab (Analytics & Trends)

1. **View Aggregated Data**
   - **High-Risk Regions**: Bar chart showing cases by region
   - **Disease Trends**: Line chart of top symptoms
   - **Risk Distribution**: Pie chart of case severity split
   - **Total Submissions**: Counter of all submitted cases

2. **Interpret Charts**
   - **Bar Chart**:
     - Red = HIGH-risk cases
     - Orange = MEDIUM-risk cases
     - Green = LOW-risk cases
     - Sorted by region with most HIGH cases first
   
   - **Line Chart**:
     - Symptom keywords from submissions
     - Y-axis = frequency (how many times mentioned)
     - Top 15 trends displayed
   
   - **Pie Chart**:
     - Overall risk level distribution
     - Shows percentage of cases in each category

3. **Refresh Data**
   - Click "Refresh" button to reload latest analytics

---

## Example Workflows

### Workflow 1: Single Patient Triage
```
1. Language: English
2. Symptoms: "chest pain, difficulty breathing"
3. Region: Maharashtra
4. Submit → Result: HIGH risk - "Seek urgent medical care immediately"
5. This submission is now included in dashboard analytics
```

### Workflow 2: Check Regional Trends
```
1. Click "Dashboard" tab
2. Look at "High-Risk Regions" bar chart
3. Identify which regions have most HIGH-risk cases
4. Check "Disease Trends" to see most common symptoms
5. Review "Risk Distribution" for overall case severity
```

### Workflow 3: Multilingual Support
```
1. Language: Hindi (हिंदी)
2. Symptoms: "छाती में दर्द" (chest pain in Hindi)
3. Region: Delhi
4. Submit → All UI text automatically in Hindi
5. Result in Hindi with advice in Hindi
```

---

## Test Data (For Demo)

Run this script to populate test data:
```powershell
cd C:\MediAssist\Backend
node tests/integration-test.js
```

This will:
- Submit 10 diverse triage requests
- Populate all 3 chart types
- Show sample analytics dashboard

---

## Troubleshooting

### Issue: "Cannot connect to backend"
```
✗ Frontend loads but shows error connecting to API
```
**Solution**:
- Verify backend is running: `http://localhost:5000/`
- Check if port 5000 is free: `netstat -ano | findstr :5000`
- Restart backend: `node server.js`

### Issue: "No data in dashboard"
```
✗ Charts are empty even though app loaded
```
**Solution**:
- Submit triage requests first (Triage tab)
- Wait 1-2 seconds
- Refresh dashboard tab
- Click "Refresh" button in dashboard

### Issue: "Language not changing"
```
✗ Selecting Hindi/Telugu doesn't update UI
```
**Solution**:
- Hard refresh browser: `Ctrl+Shift+R`
- Clear browser cache
- Check browser console for errors: `F12`

### Issue: "Port already in use"
```
✗ "EADDRINUSE" error when starting server
```
**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process
taskkill /PID <PID> /F
# Restart server
node server.js
```

---

## API Testing (Advanced)

### Test Triage API
```powershell
$body = @{
    symptoms = "chest pain"
    region = "Maharashtra"
    language = "English"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/triage" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | Select-Object -ExpandProperty Content
```

### Test Analytics API
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/analytics/summary" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json
```

---

## Performance Notes

- **First Load**: ~2-3 seconds (Vite bundle loads)
- **Dashboard Render**: <500ms (in-memory aggregation)
- **Triage AI Response**: 1-3 seconds (network latency to Groq)
- **Analytics Update**: Instant (real-time tracking)

---

## Data & Privacy

- **Storage**: In-memory (lost on server restart)
- **No Persistence**: Data not saved to disk
- **No External Storage**: All data stays on local server
- **Reset**: Restart backend to clear all submissions

For production use, implement database storage.

---

## Support & Debugging

### View Backend Logs
```
Check terminal where `node server.js` is running
Click the backend terminal to see all API requests
```

### Enable Verbose Logging
```javascript
// Add to Backend/server.js
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

### Browser Developer Tools
```
F12 → Console tab → See fetch errors and API responses
F12 → Network tab → Monitor all HTTP requests
F12 → Application → Check stored data
```

---

## Next Steps

- [ ] Deploy to cloud (Azure App Service, AWS EC2, etc.)
- [ ] Connect to database (MongoDB, PostgreSQL)
- [ ] Add user authentication
- [ ] Implement data export (PDF, CSV)
- [ ] Create doctor portal
- [ ] Add SMS/Email notifications
- [ ] Setup automated testing (Jest, Cypress)

---

**Happy Triaging!** 🏥
