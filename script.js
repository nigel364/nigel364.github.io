// ==============================================
// Dr. Diagnosis - Complete JavaScript (2025 style)
// Includes dark/light theme toggle
// ==============================================

// ─── Theme Toggle Logic ─────────────────────────────────────
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);

  // Show theme toggle only if already logged in
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn && localStorage.getItem('isLoggedIn') === 'true') {
    toggleBtn.style.display = 'flex';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = current === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleIcon(newTheme);
}

function updateToggleIcon(theme) {
  const icon = document.querySelector('#theme-toggle .icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// ─── Modal & Auth Logic ─────────────────────────────────────
function openModal(mode = 'signin') {
  document.getElementById('authModal').classList.add('show');
  switchForm(mode);
}

function closeModal() {
    // Find ALL modals that have the .show class and remove it
    document.querySelectorAll('.modal.show').forEach(modal => {
        modal.classList.remove('show');
    });
    
    // Optional: also reset any form inside auth modal if needed
    if (document.getElementById('authModal').classList.contains('show')) {
        document.getElementById('authForm').reset();
    }
}

function switchForm(mode) {
  const title = document.getElementById('formTitle');
  const btn = document.getElementById('submitBtn');
  const toggles = document.querySelectorAll('.toggle-btn');

  if (!title || !btn || !toggles.length) return;

  toggles.forEach(t => t.classList.remove('active'));

  if (mode === 'signup') {
    title.textContent = 'Sign Up';
    btn.textContent = 'Create Account';
    toggles[1]?.classList.add('active');
  } else {
    title.textContent = 'Sign In';
    btn.textContent = 'Sign In';
    toggles[0]?.classList.add('active');
  }
}

function handleAuth(e) {
  e.preventDefault();

  const titleElement = document.getElementById('formTitle');
  const isSignup = titleElement?.textContent?.toLowerCase().includes('sign up') || false;

  const emailEl = document.getElementById('email');
  const passEl  = document.getElementById('password');

  if (!emailEl || !passEl) {
    alert('Form fields not found');
    return;
  }

  const email = emailEl.value.trim();
  const pass  = passEl.value.trim();

  if (!email || !pass) {
    alert('Please fill in email and password');
    return;
  }

  if (pass.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  const validEmail = 'nigel@gmail.com';
  const validPass  = '123456';

  if (email !== validEmail || pass !== validPass) {
    alert('Invalid email or password.\n\nDemo credentials:\nEmail: nigel@gmail.com\nPassword: 123456');
    return;
  }

  // ── Success ───────────────────────────────────────────────
  if (isSignup) {
    const nameEl = document.getElementById('fullName');
    const confirmEl = document.getElementById('confirmPassword');

    if (nameEl && confirmEl) {
      const name = nameEl.value.trim();
      const confirm = confirmEl.value.trim();

      if (!name) {
        alert('Please enter your full name');
        return;
      }
      if (pass !== confirm) {
        alert('Passwords do not match');
        return;
      }

      alert(`Account created successfully!\nWelcome, ${name.split(' ')[0]}!`);
    } else {
      alert('Account created! Welcome!');
    }
  } else {
    alert('Welcome back, Nigel!');
  }

  localStorage.setItem('isLoggedIn', 'true');
  closeModal();

  const landing = document.getElementById('landing');
  const app    = document.getElementById('app');
  const toggle = document.getElementById('theme-toggle');

  if (landing) landing.style.display = 'none';
  if (app)     app.style.display    = 'block';
  if (toggle)  toggle.style.display = 'flex';

  renderHistory();
}

function logout() {
  localStorage.removeItem('isLoggedIn');

  const app = document.getElementById('app');
  const landing = document.getElementById('landing');
  const toggleBtn = document.getElementById('theme-toggle');

  if (app) app.style.display = 'none';
  if (landing) landing.style.display = 'flex';
  if (toggleBtn) toggleBtn.style.display = 'none';
}

// ─── Check login state + theme on page load ────────────────
window.onload = () => {
  // Initialize theme first
  initTheme();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    const landing = document.getElementById('landing');
    const app = document.getElementById('app');
    const toggleBtn = document.getElementById('theme-toggle');

    if (landing) landing.style.display = 'none';
    if (app) app.style.display = 'block';
    if (toggleBtn) toggleBtn.style.display = 'flex';
  }

  renderHistory();
};

// ─── ML Model Parameters ────────────────────────────────────
// ─── ML Model Parameters ────────────────────────────────────
const modelParams = {
  features: [
    "back pain",
    "chest pain",
    "chills",
    "cough",
    "diarrhea",
    "dizzy",
    "fatigue",
    "fever",
    "frequent urination",
    "headache",
    "itchy",
    "joint pain",
    "nausea",
    "rash",
    "runny nose",
    "shortness of breath",
    "sore throat",
    "stiff",
    "stomach pain",
    "sweat",
    "swelling",
    "thirst",
    "blurred vision",
    "vomiting",
    "weight loss",
    "coughing blood"
  ],

  classes: [
    "Allergic Reaction",
    "Arthritis",
    "Common Cold",
    "Diabetes",
    "Flu",
    "Gastroenteritis",
    "Heart Issue",
    "Malaria",
    "Migraine",
    "Tuberculosis",
    "Hypertension",
    "Pneumonia"
  ],

  // Coefficients matrix: 12 classes × 26 features
  coef: [
    // Allergic Reaction
    [0.3636810704757786, -0.6840867578479229, -0.08536838444704169, -0.28420613918394555, -0.20977875207949453, -0.2404027750676687, -0.06450806607665982, -0.22189193946370075, 0.14316767071076789, 0.10528191289366302, 0.6879899113985775, -0.01301708660932035, -0.2158315502203831, 0.9622330958328008, 0.11582009967102759, -0.33668354550987417, 0.3076814555672195, -0.4186531495596546, 0.14462477182923902, 0.0012180759607642634, 0.36941470593487435, -0.0787176354007024, -0.3048299068757296, -0.2360262944673161, 0.214162768392041, 0.07314463801520844],

    // Arthritis
    [-0.15094921683121246, -0.32201931173998605, 0.027186717720457765, 0.35270841617589677, 0.03162245151456327, -0.32261245371421365, -0.015325499769725782, 0.03973778197692048, -0.17225145638323913, 0.12210698601198695, 0.23261241644138153, 0.36244552634962235, 0.17777224560264254, -0.0075219418243331095, 0.14245349940728597, -0.05194511682028582, -0.29227274379490004, 0.43739311769625666, -0.01206033164470071, 0.19874773815673052, 0.016191821650350713, 0.5348893903158062, 0.13292779093770996, -0.32093369290372165, -0.10010200118267114, -0.21741625441632378],

    // Common Cold
    [0.17229767778777139, -0.1706410041373568, -0.12725155438998614, 0.6326415349152883, -0.1698551807138034, -0.4412076712897377, -0.20836794700468486, 0.2700798125356881, 0.14933625536557799, -0.12558715917387772, -0.09821980408077861, -0.21408689003097683, -0.24449175266478043, 0.015908342790889183, 0.1940342626787123, 0.133691150233794, 0.13259886780088678, -0.07967807211980023, 0.14780222118015454, -0.21618998485017502, 0.3718520579132333, 0.16162400178636063, 0.036198270313376815, -0.1058064108659868, -0.33967855856857176, 0.1575775604055357],

    // Diabetes
    [-0.6254434728324033, -0.3679631381639703, -0.23545936370822632, -0.1463548069136089, -0.24590605481273495, -0.4787377496319577, -0.2290239987978076, 0.442021449855685, -0.11324352891878571, 0.08517949969112958, -0.4416926922548102, -0.2165801003671844, 0.07447744374047716, -0.0556361154224465, -0.28451158935495646, 0.21003684575972675, 0.44451024790694244, 0.14430422185371508, 0.00202170737974213, 0.09561070523274223, 0.011007779916790679, 0.1220454965372536, 0.43380009108538164, 0.22369123993531836, 0.14444793968813233, 0.16080177382898644],

    // Flu
    [-0.05242919073613375, -0.47014045207332145, 0.40996631857149796, 0.11806939553123354, -0.1144027869486545, -0.24026372185835426, -0.2933838160670519, 0.09756158354551964, -0.1433440094792288, -0.39647638976082844, -0.13528825280840917, 0.4326446306548042, 0.10755158422127134, -0.09404936984995536, -0.1679759558736333, -0.09982223657654705, 0.2281760675450493, -0.1103477003836658, -0.5983849422660743, -0.03730856183795371, 0.04621100528859688, 0.3468983285397604, 0.06153347760962417, 0.031094037472268705, 0.3669460389035855, -0.09062598003754768],

    // Gastroenteritis
    [-0.2626135288536239, -0.3195598128967417, -0.2765982658353074, -0.24575659783722945, 0.8149595526027081, -0.09584695931924526, 0.06117613059260227, 0.27445918747871206, 0.11192292912495762, 0.33502611180304565, 0.06802837308568126, -0.30409817066410283, 0.4820600149735504, 0.06731032602513311, 0.18041785897256774, -0.022955618283691675, -0.08390602334889662, -0.06293772864065394, -0.04882339174960675, 0.03721022392431793, -0.5064232260919893, 0.2678191511352637, 0.3287163953677555, 0.7614546593052691, -0.286380543105118, -0.012911378709616696],

    // Heart Issue
    [0.1390349669686951, 0.1656230650674096, -0.5693352576075704, -0.06108561144416888, -0.3943079498292691, -0.8579341325022017, -0.24832355608104908, -0.20954449752218673, -0.0037679329950312417, 0.052547774520593275, 0.04591066818320258, -0.11981417473422497, 0.25545415133291816, -0.36208995715506787, 0.09893092263545966, 0.183115562107689, -0.3091771748287213, -0.05733847686479236, 0.3674575545110188, 0.14665718998599137, -0.07845317783823146, 0.009306959058346023, -0.44592616387259326, 0.032720574131210635, -0.011038062068981202, -0.32054497341414817],

    // Malaria
    [0.14136650923437452, -0.27832632238555827, 0.4349778716967289, 0.029502181738412753, 0.4022463453847631, -0.6834026967400506, 0.2084460519219837, -0.00652289599886438, 0.042661116015709905, -0.03829530620673591, -0.4528145264563247, -0.29883291760656144, -0.49012530144551103, -0.038535971011977435, 0.1398636041030557, 0.09302575213837497, -0.20837565831804958, 0.12174930826542021, -0.1434051243780473, -0.12861267261863646, 0.01822994846649051, 0.022581470655619308, 0.07334158772905698, -0.2653904825597303, 0.20248068315054263, 0.04161769042322365],

    // Migraine
    [0.011282123817036204, -0.6821815025397219, 0.17820370643881206, -0.20874922532679413, -0.32551381782567573, -0.5836472693783203, 0.3371635517281201, 0.4796198101131027, -0.03482532767273929, -0.23654968772666668, 0.05708591577219353, 0.15175621978499337, -0.4528139458976564, 0.12057893820093082, 0.18709644728290753, 0.10219713096806379, -0.5439265844073381, 0.3223739346089515, 0.16216275722728674, -0.6030966600816875, 0.02193551614854561, -0.14791753104240618, -0.2528908157384429, 0.25120425122959184, -0.09650050079105317, -0.6018606645997052],

    // Tuberculosis
    [0.07713278367256392, -0.6831773530496229, 0.1777299488442369, -0.13757977379634428, -0.1414564131611946, -0.4083276554537653, -0.10021455720015383, -0.2555115340659842, -0.2002853770498698, -0.10652630430148673, -0.09795450439850098, -0.25140244174478055, -0.18235647825924456, -0.40826172618789386, -0.06724323775389326, 0.1540247373635151, 0.24643955524979033, 0.08548617714404089, -0.10472186300736791, 0.2529420487345967, 0.03447310867662478, -0.41870709732817457, -0.08294481879190754, -0.182367312084368, -0.08101070349977403, 0.4557687795178778],

    // Hypertension
    [0.12602805212998058, 2.152945266474058, 0.26133256668341354, -0.07199952066228203, 0.05042036567536986, 2.191776816322104, 0.15603649289762245, -0.23704468920584326, 0.10979608502391934, -0.15580183295089942, -0.04326782551932887, 0.12467111495126701, 0.2832251115925716, -0.2855499320275507, -0.08430690568288382, -0.30277836731373564, -0.013369702458994008, -0.2408519831259653, -0.0444651349113885, 0.040835288955423196, 0.032117822070353956, -0.2866295717752812, -0.0745957158460792, -0.04390760319701523, -0.041303897314804584, 0.00023595738416564842],

    // Pneumonia
    [-0.2301711235546749, -0.36027583036015276, -0.3868581088626458, 0.011812137044050004, 0.2443441626062437, -0.00520866654130381, 0.14885561147941065, -0.4464827376206231, 0.007412060742261302, 0.4354808494534509, -0.0976425544531887, 0.3077842244172005, 0.10075281916921265, 0.34383704463894615, -0.3893708589345496, 0.1008590223733952, 0.20020696804900376, -0.13204046324497964, 0.12020259031067149, 0.37863894357444666, -0.5960750839900283, -0.4709315837997937, 0.04231706707265421, -0.08044989526423767, 0.15704478499101332, 0.4460231274241163]
  ],

  // Intercept (bias) for each class
  intercept: [
    -2.8434362023854787,
    -2.8732560475781983,
    -2.6795816472575744,
    -2.3802408482224298,
    -2.4683337223371,
    -3.4380913171607013,
    -1.4984569167805883,
    -2.071283508447571,
    -1.9409240294158603,
    -1.5634313359897924,
    -3.7046221293247714,
    -2.9067802943597227
  ]
};

const medRecommendations = {
  "Allergic Reaction": ["Cetirizine or Loratadine (antihistamine)", "Avoid known triggers"],
  "Arthritis": ["Ibuprofen or Paracetamol for pain", "Gentle movement / physio"],
  "Common Cold": ["Paracetamol", "Rest, fluids, honey for cough"],
  "Diabetes": ["Blood sugar monitoring essential", "Doctor for proper treatment"],
  "Flu": ["Paracetamol", "Rest + hydration", "Antiviral if early (doctor only)"],
  "Gastroenteritis": ["ORS / rehydration salts", "BRAT diet (banana, rice, apple, toast)"],
  "Heart Issue": ["URGENT – Call emergency / see cardiologist"],
  "Malaria": ["Urgent blood test + antimalarials (doctor only)"],
  "Migraine": ["Ibuprofen / specific migraine medication", "Dark quiet room"],
  "Tuberculosis": ["URGENT – See doctor for testing & long-term antibiotics"],
  "Hypertension": ["Monitor BP", "Low salt diet – see doctor"],
  "Pneumonia": ["URGENT – Antibiotics likely needed", "Oxygen if severe"]
};

// ─── Symptom Processing & Diagnosis ─────────────────────────
function normalizeSymptom(s) {
  return s.toLowerCase().trim()
    .replace(/runny nose \/ congestion/i, "runny nose")
    .replace(/excessive sweating/i, "sweat")
    .replace(/blurred vision/i, "blurred vision")
    .replace(/stiff neck \/ joints/i, "stiff")
    .replace(/coughing up blood/i, "coughing blood");
}

function checkSymptoms() {
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  loading.style.display = "block";
  result.style.display = "none";

  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  let symptoms = Array.from(checkboxes).map(cb => normalizeSymptom(cb.value));

  const other = document.getElementById("other").value.toLowerCase().trim();
  if (other) {
    const extra = other.split(/[,;.\s]+/).filter(s => s.trim());
    symptoms = [...new Set([...symptoms, ...extra])];
  }

  if (symptoms.length === 0) {
    alert("Please select at least one symptom or describe something!");
    loading.style.display = "none";
    return;
  }

  const possibleDiseases = predictDiseases(symptoms);

  let possibleMeds = [];
  possibleDiseases.forEach(d => {
    if (medRecommendations[d.disease]) {
      possibleMeds.push(...medRecommendations[d.disease].map(m => `${m} — for possible ${d.disease}`));
    }
  });

  if (possibleDiseases.length === 0) {
    possibleDiseases.push({ disease: "Unclear pattern – more symptoms needed", probability: 0 });
    possibleMeds = ["Stay hydrated", "Rest well", "Monitor your symptoms"];
  }

  document.getElementById("diseases").innerHTML = possibleDiseases.map(d => `
    <div class="condition-card tilt-card">
      <strong>${d.disease}</strong> — ${Math.round(d.probability * 100)}%
      <div class="prob-bar"><div class="prob-fill" style="width: ${Math.round(d.probability * 100)}%"></div></div>
    </div>
  `).join("");

  document.getElementById("medicines").innerHTML = possibleMeds.length > 0
    ? "<ul>" + possibleMeds.map(m => `<li>${m}</li>`).join("") + "</ul>"
    : "<p>No specific general suggestions — consult a doctor soon.</p>";

  result.style.display = "block";
  loading.style.display = "none";
  result.scrollIntoView({ behavior: "smooth" });

  saveToHistory(symptoms, possibleDiseases);
}

function resetForm() {
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById("other").value = "";
  document.getElementById("result").style.display = "none";
  document.getElementById("loading").style.display = "none";
}

function predictDiseases(symptoms) {
  const x = new Array(modelParams.features.length).fill(0);
  symptoms.forEach(s => {
    let idx = modelParams.features.indexOf(s);
    if (idx === -1) {
      idx = modelParams.features.findIndex(f => f.includes(s) || s.includes(f));
    }
    if (idx !== -1) x[idx] = 1;
  });

  const logits = [];
  for (let i = 0; i < modelParams.classes.length; i++) {
    let logit = modelParams.intercept[i];
    for (let j = 0; j < x.length; j++) {
      logit += modelParams.coef[i][j] * x[j];
    }
    logits.push(logit);
  }

  const logitsTensor = tf.tensor1d(logits);
  const probsTensor = tf.softmax(logitsTensor);
  const probs = probsTensor.dataSync();

  const results = [];
  for (let i = 0; i < probs.length; i++) {
    if (probs[i] > 0.08) {
      results.push({ disease: modelParams.classes[i], probability: probs[i] });
    }
  }

  results.sort((a, b) => b.probability - a.probability);
  return results.slice(0, 6);
}

// ─── Symptom History Management ─────────────────────────────
const HISTORY_KEY = 'diagnosisHistory';
const MAX_HISTORY = 10;

function saveToHistory(symptoms, possibleDiseases) {
  const entry = {
    timestamp: new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }),
    symptoms: symptoms,
    conditions: possibleDiseases.map(d => ({
      disease: d.disease,
      probability: Math.round(d.probability * 100)
    }))
  };

  let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;

  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

  if (history.length === 0) {
    list.innerHTML = '<p style="text-align:center; opacity:0.7;">No previous checks yet.</p>';
    return;
  }

  list.innerHTML = history.map((entry, index) => `
    <div class="history-item tilt-card" onclick="loadHistory(${index})">
      <button class="delete-item" onclick="deleteHistory(${index}); event.stopPropagation();">×</button>
      <h4>${entry.conditions[0]?.disease || 'Unclear result'} • ${entry.conditions[0]?.probability || '?'}%</h4>
      <span class="date">${entry.timestamp}</span>
      <div class="summary">
        Symptoms: ${entry.symptoms.slice(0, 5).join(', ')}${entry.symptoms.length > 5 ? ' ...' : ''}
      </div>
      <button class="toggle-symptoms" onclick="toggleSymptoms(this); event.stopPropagation();">Show full symptoms</button>
      <div class="full-symptoms">
        Full symptoms: ${entry.symptoms.join(', ')}
      </div>
    </div>
  `).join('');
}

function toggleSymptoms(btn) {
  const full = btn.nextElementSibling;
  full.classList.toggle('show');
  btn.textContent = full.classList.contains('show') ? 'Hide full symptoms' : 'Show full symptoms';
}

function loadHistory(index) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  if (!history[index]) return;

  resetForm();

  const entry = history[index];
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = entry.symptoms.includes(normalizeSymptom(cb.value));
  });

  const checkboxValues = Array.from(document.querySelectorAll('input[type="checkbox"]')).map(cb => normalizeSymptom(cb.value));
  const freeText = entry.symptoms.filter(s => !checkboxValues.includes(s));
  document.getElementById('other').value = freeText.join(', ');

  checkSymptoms(); // auto-run diagnosis
}

function deleteHistory(index) {
  if (!confirm('Delete this entry?')) return;
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  history.splice(index, 1);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function clearHistory() {
  if (!confirm('Clear all history?')) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function exportHistory() {
  const history = localStorage.getItem(HISTORY_KEY) || '[]';
  const blob = new Blob([history], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dr-diagnosis-history-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
function fakeSocialAuth(provider) {
      alert(`Continuing with ${provider}... (this is a demo — no real auth)\n\nYou would be redirected to ${provider} login in a real app.`);
      // Optionally auto-login for demo
      // localStorage.setItem('isLoggedIn', 'true');
      // closeModal();
      // document.getElementById('landing').style.display = 'none';
      // document.getElementById('app').style.display = 'block';
      // document.getElementById('theme-toggle').style.display = 'flex';
      // renderHistory();
    }
// ─── Initialize 3D Tilt on dynamic content ──────────────────
document.addEventListener('DOMContentLoaded', () => {
  function initTilt() {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.45,
      scale: 1.04,
      perspective: 950
    });
  }

  // Initial tilt for static elements
  initTilt();

  // Re-init after dynamic updates
  const originalCheck = checkSymptoms;
  checkSymptoms = function() {
    originalCheck.apply(this, arguments);
    setTimeout(initTilt, 100);
  };

  const originalRender = renderHistory;
  renderHistory = function() {
    originalRender.apply(this, arguments);
    setTimeout(initTilt, 50);
  };

  // Attach theme toggle listener
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
});
// Side Nav Functions
function openNav() {
  document.getElementById("sideNav").classList.add("open");
  document.getElementById("navOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeNav() {
  document.getElementById("sideNav").classList.remove("open");
  document.getElementById("navOverlay").classList.remove("active");
  document.body.style.overflow = "auto";
}

function goToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Theme Toggle in Nav
document.getElementById("nav-theme-toggle").addEventListener("click", function() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  
  // Update icon and text
  const icon = this.querySelector("i");
  const text = this.querySelector("span");
  if (newTheme === "light") {
    icon.classList.replace("fa-moon", "fa-sun");
    text.textContent = "Light Mode";
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
    text.textContent = "Dark Mode";
  }
});

// Also sync with your existing theme toggle button
document.getElementById("theme-toggle").addEventListener("click", function() {
  document.getElementById("nav-theme-toggle").click();
});
function showAbout() {
  document.getElementById("aboutModal").classList.add("show");
}

function showProfile() {
  document.getElementById("profileModal").classList.add("show");
  document.getElementById("historyCount").textContent = 
    JSON.parse(localStorage.getItem("symptomHistory") || "[]").length;
}
// Symptom Search Filter
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('symptomSearch');
  const symptomItems = document.querySelectorAll('.symptom-item');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      symptomItems.forEach(item => {
        const label = item.querySelector('label');
        const text = label.textContent.toLowerCase();

        if (text.includes(query) || query === '') {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});

// New function for showing history from side nav
function showHistory() {
    // Optional: refresh / re-render list before opening
    // if (typeof loadHistory === 'function') loadHistory();
    
    const modal = document.getElementById('historyModal');
    if (modal) {
        modal.classList.add('show');
    }
}
// Optional: Collapse all except first on load
document.querySelectorAll('.symptom-category').forEach((cat, index) => {
  if (index > 0) cat.removeAttribute('open');
});