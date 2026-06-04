// ============================================
// QUIZ STATE MANAGEMENT
// ============================================
const quizData = {
    sender: null,
    tone: null,
    subject: null,
    energy: 50,
    customTone: '',
    phraseStyle: 'auto',
    toneStrength: 50,
    message: ''
};

let currentStep = 1;
const totalSteps = 4;
let latestResult = null;
let customToneContainer;
let customToneInput;
let toneExample;
let customToneHelper;

let replyData = null;
const replyDataFallback = {
    subjectOptionsBySender: {
        crush: [
            { value: 'plans', label: 'Plans / Hangout', icon: '📅', description: 'Make plans, dates, or meetups.' },
            { value: 'apology', label: 'Apology / Feelings', icon: '🙏', description: 'Emotional or relationship messages.' },
            { value: 'invitation', label: 'Invitation', icon: '🎉', description: 'Events, dates, or hangout invites.' },
            { value: 'support', label: 'Support / Feelings', icon: '💬', description: 'Emotional support or encouragement.' },
            { value: 'update', label: 'Update / News', icon: '📢', description: 'Casual news or personal updates.' }
        ],
        bestie: [
            { value: 'plans', label: 'Plans / Hangout', icon: '📅', description: 'Weekend plans, coffee, or last-minute meetups.' },
            { value: 'support', label: 'Support / Feelings', icon: '💬', description: 'Advice, encouragement, or emotional backup.' },
            { value: 'update', label: 'Update / News', icon: '📢', description: 'Life updates, gossip, or check-ins.' },
            { value: 'checkin', label: 'Check-in', icon: '👀', description: 'Casual "how are you" or follow-up messages.' },
            { value: 'invitation', label: 'Invitation', icon: '🎉', description: 'Group plans, hangouts, or fun invites.' }
        ],
        friend: [
            { value: 'plans', label: 'Plans / Hangout', icon: '📅', description: 'Casual meetups and plan-making.' },
            { value: 'invitation', label: 'Invitation', icon: '🎉', description: 'Party invites or outing ideas.' },
            { value: 'support', label: 'Support / Feelings', icon: '💬', description: 'Emotional talk or check-ins.' },
            { value: 'update', label: 'Update / News', icon: '📢', description: 'What’s new and what’s happening.' },
            { value: 'feedback', label: 'Feedback / Request', icon: '📝', description: 'Advice, favors, or tips.' }
        ],
        lover: [
            { value: 'plans', label: 'Plans / Date', icon: '📅', description: 'Date plans, dinner, or romantic time together.' },
            { value: 'apology', label: 'Apology / Hearts', icon: '🙏', description: 'Emotional or relationship-driven messages.' },
            { value: 'support', label: 'Support / Feelings', icon: '💬', description: 'Reassurance, affection, or care.' },
            { value: 'invitation', label: 'Invitation', icon: '🎉', description: 'Special invites or shared experiences.' },
            { value: 'update', label: 'Update / News', icon: '📢', description: 'Personal updates or check-ins.' }
        ],
        boss: [
            { value: 'work', label: 'Work / Task', icon: '💼', description: 'Project updates, deadlines, or tasks.' },
            { value: 'feedback', label: 'Feedback / Request', icon: '📝', description: 'Performance notes or asks.' },
            { value: 'update', label: 'Status / Update', icon: '📢', description: 'Progress reports and status checks.' },
            { value: 'support', label: 'Help / Support', icon: '🛠️', description: 'Requests for assistance or clarifications.' }
        ],
        family: [
            { value: 'plans', label: 'Plans / Family Time', icon: '📅', description: 'Family plans, visits, or shared events.' },
            { value: 'support', label: 'Support / Feelings', icon: '💬', description: 'Emotional check-ins and support.' },
            { value: 'update', label: 'Update / News', icon: '📢', description: 'Household news or family updates.' },
            { value: 'feedback', label: 'Feedback / Request', icon: '📝', description: 'Requests for help or advice.' },
            { value: 'apology', label: 'Apology / Relationship', icon: '🙏', description: 'Emotional or relational conversations.' }
        ],
        ex: [
            { value: 'apology', label: 'Apology / Closure', icon: '🙏', description: 'Emotional or respectful responses.' },
            { value: 'update', label: 'Update / News', icon: '📢', description: 'Short news or followups.' },
            { value: 'support', label: 'Support / Feelings', icon: '💬', description: 'Boundaries or emotional replies.' },
            { value: 'feedback', label: 'Feedback / Request', icon: '📝', description: 'Clarifications or requests.' }
        ],
        'potential-date': [
            { value: 'plans', label: 'Plans / Date', icon: '📅', description: 'Date ideas or meetup plans.' },
            { value: 'invitation', label: 'Invitation', icon: '🎉', description: 'Casual event or hangout invites.' },
            { value: 'support', label: 'Support / Feelings', icon: '💬', description: 'Emotional or interest-based replies.' },
            { value: 'update', label: 'Update / News', icon: '📢', description: 'Light personal updates.' },
            { value: 'feedback', label: 'Feedback / Request', icon: '📝', description: 'Questions or requests for details.' }
        ]
    },
    promptSubjectText: {
        plans: 'a scheduling or plans message',
        apology: 'an apology or relationship message',
        drama: 'a dramatic or urgent message',
        work: 'a work-related message',
        checkin: 'a casual check-in message',
        invitation: 'an invitation or hangout message',
        support: 'a support or feelings message',
        update: 'an update or news message',
        feedback: 'a feedback or request message'
    },
    senderDefaults: {
        crush: [
            'Hey, I saw your message and wanted to keep this sweet but not too much.',
            'Thanks for writing. I’m replying with a gentle, warm vibe that still feels easygoing.',
            'I liked hearing from you. I’m staying friendly, curious, and a little shy.'
        ],
        bestie: [
            'Hey bestie! I’m answering like your go-to person who gets the vibe.',
            'I’m keeping this warm and honest, with a bit of extra support.',
            'I heard you. I’m replying with the kind of energy only a bestie gives.'
        ],
        friend: [
            'Hey! I got your message. I’m answering like a real friend — casual, honest, and easy.',
            'Thanks for reaching out. I’m keeping this relaxed, upbeat, and friendly.',
            'I heard you. I’m replying with a normal, warm friend voice.'
        ],
        lover: [
            'I saw your message and I’m answering with warmth and affectionate energy.',
            'I’m replying with gentle enthusiasm and a little romantic care.',
            'I’m keeping it sweet, sincere, and present.'
        ],
        boss: [
            'Thanks for the update. I’m replying clearly and professionally.',
            'I appreciate this message. I’m keeping it concise, polite, and focused on the next step.',
            'I got your note and will answer with respect and the right work tone.'
        ],
        family: [
            'Thank you for the message. I’m replying kindly and with respect.',
            'I appreciate what you said. I’m keeping this calm, honest, and caring.',
            'I got your note. I’m answering in a warm, supportive way.'
        ],
        ex: [
            'I got your message. I’m replying politely with clear boundaries.',
            'Thanks for reaching out. I’m keeping this short, respectful, and simple.',
            'I heard you. I’m answering in a calm, composed way.'
        ],
        'potential-date': [
            'Hey, I saw your message. I’m replying warmly and a little curious.',
            'Thanks for reaching out. I’m keeping it friendly, interested, and relaxed.',
            'I liked hearing from you. I’m answering with a light flirt and a calm tone.'
        ]
    }
};

async function loadReplyData() {
    const warning = document.getElementById('data-warning');
    try {
        const response = await fetch('reply-data.json');
        if (!response.ok) throw new Error('Reply data not found');
        const data = await response.json();
        replyData = data;
        if (warning) {
            warning.classList.add('hidden');
            warning.textContent = '';
        }
        console.log('Reply data loaded from reply-data.json');
    } catch (error) {
        console.warn('Could not load reply-data.json, using fallback data.', error);
        replyData = replyDataFallback;
        if (warning) {
            warning.textContent = 'Could not load reply-data.json. Using built-in fallback instead. For the best experience, serve this app through a local HTTP server rather than opening index.html directly.';
            warning.classList.remove('hidden');
        }
    }
}

function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// ============================================
// STEP NAVIGATION
// ============================================
function moveToStep(stepNumber, formSteps, progressFill) {
    if (stepNumber === 2 && !quizData.sender) return;
    if (stepNumber === 3 && !quizData.tone) return;
    if (stepNumber === 4 && !quizData.subject) return;

    formSteps.forEach(step => step.classList.remove('active'));
    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    currentStep = stepNumber;
    updateProgress(progressFill);
}

// Force move to a step without validation (used by Back buttons)
function moveToStepForced(stepNumber, formSteps, progressFill) {
    formSteps.forEach(step => step.classList.remove('active'));
    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    currentStep = stepNumber;
    updateProgress(progressFill);
}

// ============================================
// PROGRESS BAR
// ============================================
function updateProgress(progressFill) {
    let progress = 0;

    if (quizData.sender) progress += 25;
    if (quizData.tone) progress += 25;
    if (quizData.subject) progress += 25;
    if (quizData.energy !== null && currentStep > 3) progress += 25;

    progressFill.style.width = progress + '%';
}

function getEnergyLabel(value) {
    if (value < 20) return 'Very low';
    if (value < 40) return 'Low';
    if (value < 60) return 'Balanced';
    if (value < 80) return 'High';
    return 'Maximum';
}

function getToneExample(tone) {
    const examples = {
        'passive-aggressive': 'Short, clipped, annoyed text like "K." or "Fine."',
        essay: 'Long, detailed messages that over-explain or vent all at once.',
        vague: 'Unclear, cryptic text like "We need to talk..." or "If you know, you know."',
        normal: 'A typical friendly message like "Hey, what\'s up?"',
        'mixed-signals': 'Messages that feel confusing or inconsistent, like "Maybe later?" then "Call me."',
        ghosting: 'Very short replies or silence, like "k" or a single emoji.',
        custom: 'Describe the tone in your own words, then press Enter to continue.'
    };
    return examples[tone] || 'Pick the message tone to see a real example here.';
}

function updateEnergyLabel(value, labelElement) {
    if (!labelElement) return;
    const labelText = getEnergyLabel(value);
    labelElement.textContent = `Energy: ${labelText} (${value}%)`;
}

function getSampleReplies(sender, tone, customTone, message, energy, toneStrength, phraseStyle, subject) {
    const data = replyData || replyDataFallback;
    const contextText = message ? ` About their message: "${message}"` : '';
    const toneHint = tone === 'custom' ? customTone : tone.replace(/-/g, ' ');
    const energyLabel = energy < 35
        ? 'Short and low-effort'
        : energy < 70
            ? 'Balanced and natural'
            : 'Open and a little more expressive';

    const senderDefaults = data.senderDefaults || {};
    const subjectTemplates = data.subjectTemplates || {};
    const subjectPool = subject && subjectTemplates[subject] && subjectTemplates[subject][sender]
        ? subjectTemplates[subject][sender].map(reply => `${reply}${contextText}`)
        : [];
    const senderPool = subjectPool.length
        ? subjectPool
        : (senderDefaults[sender] || []).map(reply => `${reply}${contextText}`);

    const defaultReplies = [
        `Thanks for the message. I’m answering clearly and respectfully.${contextText}`,
        `I appreciate what you said. I’m keeping this calm and honest.${contextText}`,
        `I heard you. I’m replying in a simple, thoughtful way.${contextText}`
    ];

    const pool = senderPool.length ? senderPool : defaultReplies;

    function shuffleArray(arr) {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function applyTone(replyText) {
        if (tone === 'ghosting') {
            const simple = replyText.split(/[.?!]/)[0].trim();
            return simple.length < 5 ? simple : `${simple}.`;
        }
        if (tone === 'passive-aggressive') {
            return replyText.replace(/Thanks for/i, 'Fine, thanks for').replace(/I’m/i, 'I’m just').replace(/\.$/, '...');
        }
        if (tone === 'vague') {
            return `${replyText} Maybe we’ll see where it goes.`;
        }
        if (tone === 'essay') {
            return replyText;
        }
        if (tone === 'mixed-signals') {
            return `${replyText} I’m keeping it steady even if the vibe is a bit unclear.`;
        }
        if (tone === 'custom') {
            return replyText;
        }
        return replyText;
    }

    function applyStrength(text) {
        if (typeof toneStrength !== 'number') return text;
        if (toneStrength < 30) {
            if (text.startsWith('Be ')) {
                return text.replace(/^Be /, 'Maybe be ');
            }
            return `I’m trying to keep this soft and gentle. ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
        }
        if (toneStrength > 70) {
            let stronger = text.replace(/\bI’m\b/gi, 'I am').replace(/\bI will\b/gi, "I'll");
            stronger = stronger.replace(/ maybe /gi, ' ');
            if (!/[!?.]$/.test(stronger)) stronger += '!';
            return stronger;
        }
        return text;
    }

    function applyStyle(text, styleName) {
        let t = text;
        if (styleName === 'auto') {
            const mapping = {
                crush: 'playful',
                boss: 'formal',
                bestie: 'casual',
                friend: 'casual',
                family: 'formal',
                ex: 'direct',
                'potential-date': 'playful'
            };
            styleName = mapping[sender] || 'casual';
        }

        if (styleName === 'formal') {
            t = t.replace(/\bI'm\b/gi, 'I am').replace(/\bI've\b/gi, 'I have').replace(/\bI'll\b/gi, 'I will');
            t = t.replace(/\bThanks\b/gi, 'Thank you');
            t = t.replace(/\bHey[,.]?\b/gi, 'Hello');
        }
        if (styleName === 'casual') {
            t = t.replace(/\bI will\b/gi, "I'll");
            t = t.replace(/\bThank you\b/g, 'Thanks');
        }
        if (styleName === 'playful') {
            if (!/[😊😉❤️💕😄]$/.test(t) && Math.random() > 0.4) {
                const extras = ['😊', '😉', '❤️', '💕'];
                t += ' ' + extras[Math.floor(Math.random() * extras.length)];
            }
            t = t.replace(/\bI’m replying with\b/gi, 'I’m going to keep it');
        }
        if (styleName === 'direct') {
            t = t.replace(/\bI am replying with\b/gi, 'I will');
            t = t.replace(/\bI’m replying with\b/gi, 'I will');
            t = t.split(/[.?!]/)[0].trim() + '.';
        }
        return t;
    }

    const shuffled = shuffleArray(pool);
    const raw = shuffled.slice(0, 3).map((reply) => {
        let phrased = reply;
        phrased = applyTone(phrased);
        phrased = applyStrength(phrased);
        return applyStyle(phrased, phraseStyle);
    });

    const final = [];
    const seen = new Set();
    raw.forEach((reply) => {
        const normalized = reply.trim().toLowerCase();
        if (seen.has(normalized)) return;
        seen.add(normalized);
        final.push(reply);
    });

    while (final.length < 3) {
        final.push(`${final[final.length - 1]} (another version)`);
    }

    return final.slice(0, 3);
}

function getPromptSubjectText(subject) {
    const labels = (replyData && replyData.promptSubjectText) ? replyData.promptSubjectText : {
        plans: 'a scheduling or plans message',
        apology: 'an apology or relationship message',
        work: 'a work-related message',
        checkin: 'a casual check-in message',
        invitation: 'an invitation or hangout message',
        support: 'a support or feelings message',
        update: 'an update or news message',
        feedback: 'a feedback or request message'
    };
    return labels[subject] || 'a message';
}

function renderSubjectOptions(sender) {
    const container = document.getElementById('subject-choice-grid');
    const note = document.getElementById('subject-step-note');
    if (!container) return;

    const data = replyData || replyDataFallback;
    const subjects = (data.subjectOptionsBySender && data.subjectOptionsBySender[sender])
        ? data.subjectOptionsBySender[sender]
        : [];

    const dramaCard = `
        <button class="choice-card" data-type="subject" data-value="drama">
            🎭 Drama / Emergency
            <span class="choice-description">Urgent situations, emotional flare-ups, or attention-seeking messages.</span>
        </button>
    `;

    container.innerHTML = dramaCard + subjects.map(item => `
        <button class="choice-card" data-type="subject" data-value="${item.value}">
            ${item.icon} ${item.label}
            <span class="choice-description">${item.description}</span>
        </button>
    `).join('');

    if (note) {
        note.textContent = subjects.length
            ? `This sender typically sends ${subjects.map(s => s.label.toLowerCase()).slice(0, 3).join(', ')}... choose the best fit.`
            : 'Choose the subject that best matches the message.';
    }
}

function handleChoiceCardClick(button, formSteps, progressFill) {
    const type = button.getAttribute('data-type');
    const value = button.getAttribute('data-value');
    if (!type || !value) return;

    const siblingButtons = document.querySelectorAll(`.choice-card[data-type="${type}"]`);
    siblingButtons.forEach(btn => btn.classList.remove('selected'));

    button.classList.add('selected');
    quizData[type] = value;

    if (type === 'sender') {
        quizData.subject = null;
        renderSubjectOptions(value);
    }

    if (type === 'tone') {
        toneExample.textContent = getToneExample(value);
        if (value === 'custom') {
            customToneContainer.classList.remove('hidden');
            if (customToneHelper) customToneHelper.classList.remove('hidden');
            customToneInput.focus();
            quizData.customTone = '';
        } else {
            customToneContainer.classList.add('hidden');
            if (customToneHelper) customToneHelper.classList.add('hidden');
            quizData.customTone = '';
        }
    }

    if (type === 'sender' && quizData.sender) {
        setTimeout(() => moveToStep(2, formSteps, progressFill), 300);
    }

    updateProgress(progressFill);
}

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem('replyHistory') || '[]');
    } catch {
        return [];
    }
}

function saveHistoryItem(item) {
    const history = loadHistory();
    history.unshift(item);
    if (history.length > 5) history.length = 5;
    localStorage.setItem('replyHistory', JSON.stringify(history));
}

function clearHistory() {
    localStorage.removeItem('replyHistory');
    renderHistory();
}

function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    const history = loadHistory();

    if (!historyList) return;
    if (!history.length) {
        historyList.innerHTML = '<p class="history-empty">No saved replies yet.</p>';
        return;
    }

    historyList.innerHTML = history.map(item => {
        const senderLabel = item.sender.replace(/-/g, ' ');
        const toneLabel = item.tone === 'custom' ? item.customTone : item.tone.replace(/-/g, ' ');
        const subjectLabel = item.subject ? item.subject.replace(/-/g, ' ') : 'unknown subject';
        return `
            <div class="history-item">
                <div><strong>${senderLabel}</strong> — ${toneLabel} — ${subjectLabel}</div>
                <div class="history-meta">Energy: ${item.energy}% · ${formatTimestamp(item.timestamp)}</div>
                <p>${item.advice}</p>
            </div>
        `;
    }).join('');
}

function copyFullPackage() {
    const strategyText = document.getElementById('strategy-text').textContent;
    const aiPrompt = document.getElementById('ai-prompt-box').value;
    const message = quizData.message ? `Original message: "${quizData.message}"\n\n` : '';
    const copyText = `${strategyText}\n\n${message}${aiPrompt}`;

    navigator.clipboard.writeText(copyText).then(() => {
        alert('Reply package copied to clipboard.');
    }).catch(err => {
        alert('Could not copy reply package.');
        console.error('Copy error:', err);
    });
}

function renderSuggestedReplies(replies) {
    const container = document.getElementById('reply-samples');
    if (!container) return;
    container.innerHTML = replies.map((reply, index) => `
        <div class="reply-sample">
            <div class="reply-sample-row">
                <span class="reply-label">Option ${index + 1}</span>
                <button class="copy-reply-btn" data-index="${index}" aria-label="Copy reply">📋 Copy</button>
            </div>
            <p>${reply}</p>
        </div>
    `).join('');
}

function copyReply(text, btn) {
    if (!navigator.clipboard) {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        if (btn) {
            const orig = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = orig, 1500);
        }
        return Promise.resolve();
    }

    return navigator.clipboard.writeText(text).then(() => {
        if (btn) {
            const original = btn.textContent;
            btn.textContent = '✅ Copied';
            setTimeout(() => { btn.textContent = original; }, 1500);
        }
    }).catch(err => {
        console.error('Copy failed', err);
        if (btn) {
            const original = btn.textContent;
            btn.textContent = 'Copy failed';
            setTimeout(() => { btn.textContent = original; }, 1500);
        }
    });
}

// ============================================
// LOADING SCREEN
// ============================================
function showLoadingScreen(formSteps) {
    formSteps.forEach(step => step.classList.remove('active'));
    document.getElementById('loading-screen').classList.add('active');

    const loadingMessages = [
        'Analyzing text punctuation...',
        'Calculating panic levels...',
        'Consulting the anxiety database...',
        'Running social risk assessment...',
        'Generating optimal response...'
    ];

    let messageIndex = 0;
    const loadingText = document.getElementById('loadingText');

    const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingText.textContent = loadingMessages[messageIndex];
    }, 500);

    setTimeout(() => clearInterval(messageInterval), 2500);
}

// ============================================
// RESULT GENERATION LOGIC
// ============================================
function generatePromptForEnergy(sender, tone, energy, customTone, message, toneStrength, phraseStyle, subject) {
    const promptTone = tone === 'normal'
        ? 'a normal message'
        : tone === 'ghosting'
            ? 'a one-word / ghosting reply'
            : tone === 'mixed-signals'
                ? 'a mixed-signals message'
                : tone === 'custom'
                    ? `a message with the tone described as: "${customTone || 'custom tone'}"`
                    : `a ${tone} message`;
    const promptSubject = subject ? ` about ${getPromptSubjectText(subject)}` : '';
    const category = Math.min(4, Math.floor(energy / 20));
    const messageContext = message ? ` Use this exact message: "${message}".` : '';

    function makeResult(advice, prompt) {
        const finalPrompt = prompt.includes(promptSubject) ? prompt : `${prompt}${promptSubject}`;
        return {
            advice,
            prompt: `${finalPrompt}${messageContext}`,
            replies: getSampleReplies(sender, tone, customTone, message, energy, toneStrength, phraseStyle, subject)
        };
    }

    const crushPrompts = [
        {
            advice: '❤️ Low energy crush mode: Keep it tiny, cute, and slightly mysterious. Say less, mean more.',
            prompt: `Write a very short, flirty response to my crush's ${promptTone}${promptSubject}. Keep it casual, confident, and low-effort.`
        },
        {
            advice: '💕 Quiet crush energy: Be gentle and playful without overthinking it. Keep it warm and easy.',
            prompt: `Write a short, gentle reply to my crush's ${promptTone}. Make it sweet, calm, and a little flirty.`
        },
        {
            advice: '💫 Balanced crush energy: Match their mood and add a small spark. Keep it polished but natural.',
            prompt: `Write a thoughtful but light reply to my crush's ${promptTone}. Keep it engaging, confident, and authentic.`
        },
        {
            advice: '✨ High energy crush mode: Show interest and personality. Add a little charm and confidence.',
            prompt: `Write a warm, confident response to my crush's ${promptTone}. Make it engaging and show your personality.`
        },
        {
            advice: '🔥 Maximum crush energy: Be bold, playful, and memorable. This should sound authentic and fun.',
            prompt: `Write a witty, flirty response to my crush's ${promptTone}. Be bold, charming, and keep the conversation moving.`
        }
    ];

    const bossPrompts = [
        {
            advice: '👔 Very low boss energy: Keep it short, polite, and purely informational. No extra enthusiasm.',
            prompt: `Write a concise, professional reply to my boss's ${promptTone}${promptSubject}. Be polite, direct, and keep it minimal.`
        },
        {
            advice: '👔 Low boss energy: Maintain formality and clarity but still be helpful.',
            prompt: `Write a clear, professional response to my boss's ${promptTone}. Keep it friendly but to the point.`
        },
        {
            advice: '👔 Medium boss energy: Be respectful, thoughtful, and slightly more responsive.',
            prompt: `Write a professional and courteous reply to my boss's ${promptTone}. Include a brief acknowledgement and a useful answer.`
        },
        {
            advice: '👔 High boss energy: Be prompt, confident, and polished. Show you understand the context.',
            prompt: `Write a polished, professional response to my boss's ${promptTone}. Be clear, respectful, and proactive.`
        },
        {
            advice: '👔 Maximum boss energy: Be professional with a helpful tone. Show confidence without being too casual.',
            prompt: `Write a confident, professional reply to my boss's ${promptTone}. Be concise, courteous, and solution-oriented.`
        }
    ];

    const friendPrompts = [
        {
            advice: '🥑 Very low friend energy: Keep it short and honest. A simple message is enough.',
            prompt: `Write a short, honest reply to my friend's ${promptTone}${promptSubject}. Keep it relaxed and real.`
        },
        {
            advice: '🥑 Low friend energy: Be warm but minimal. Let them know you care without overcommitting.',
            prompt: `Write a casual, low-energy response to my friend's ${promptTone}. Keep it friendly and easygoing.`
        },
        {
            advice: '🥑 Medium friend energy: Be friendly and a little more engaged. Keep it authentic.',
            prompt: `Write a genuine reply to my friend's ${promptTone}. Include warmth and a relaxed tone.`
        },
        {
            advice: '🥑 High friend energy: Be playful and friendly. Show interest without sounding too formal.',
            prompt: `Write a warm, conversational reply to my friend's ${promptTone}. Keep it fun and approachable.`
        },
        {
            advice: '🥑 Maximum friend energy: Be upbeat, open, and a bit extra. This should feel like a good friend reply.',
            prompt: `Write an enthusiastic, friendly response to my friend's ${promptTone}. Keep it positive and engaging.`
        }
    ];

    const bestiePrompts = [
        {
            advice: '👑 Very low bestie energy: Keep it short and supportive. Stay steady and kind.',
            prompt: `Write a short, caring reply to my bestie's ${promptTone}${promptSubject}. Keep it warm and direct.`
        },
        {
            advice: '👑 Low bestie energy: Be honest and supportive without overdoing it.',
            prompt: `Write a casual, thoughtful response to my bestie's ${promptTone}. Keep it comforting and straightforward.`
        },
        {
            advice: '👑 Medium bestie energy: Show support and a little personality. Keep it genuine.',
            prompt: `Write a supportive reply to my bestie's ${promptTone}. Make it feel close and real.`
        },
        {
            advice: '👑 High bestie energy: Be upbeat and empathetic. Show you care and you’re there.',
            prompt: `Write a warm, enthusiastic response to my bestie's ${promptTone}. Keep it fun and reassuring.`
        },
        {
            advice: '👑 Maximum bestie energy: Be extra supportive and a bit playful. This should feel like bestie energy.',
            prompt: `Write a very supportive reply to my bestie's ${promptTone}. Keep it caring, genuine, and close.`
        }
    ];

    const loverPrompts = [
        {
            advice: '💘 Very low lover energy: Keep it gentle and affectionate. Be calm and sincere.',
            prompt: `Write a short, loving reply to my lover's ${promptTone}${promptSubject}. Keep it kind and warm.`
        },
        {
            advice: '💘 Low lover energy: Be sweet and present, with a touch of tenderness.',
            prompt: `Write a gentle, thoughtful response to my lover's ${promptTone}. Keep it sincere and caring.`
        },
        {
            advice: '💘 Medium lover energy: Show warmth and connection. Be affectionate but not over the top.',
            prompt: `Write a sincere reply to my lover's ${promptTone}. Make it warm, clear, and close.`
        },
        {
            advice: '💘 High lover energy: Be expressive and caring. Let them know you’re engaged.',
            prompt: `Write a warm, engaged response to my lover's ${promptTone}. Keep it heartfelt and genuine.`
        },
        {
            advice: '💘 Maximum lover energy: Be bold and affectionate. This should feel tender and memorable.',
            prompt: `Write an intimate, confident reply to my lover's ${promptTone}. Keep it charming and full of warmth.`
        }
    ];

    const familyPrompts = [
        {
            advice: '🏡 Very low family energy: Keep it brief and respectful. Use a gentle tone.',
            prompt: `Write a quiet, respectful reply to my family member's ${promptTone}${promptSubject}. Keep it short and sincere.`
        },
        {
            advice: '🏡 Low family energy: Be polite and honest. Keep it kind without extra fluff.',
            prompt: `Write a polite response to my family member's ${promptTone}. Keep it sincere and brief.`
        },
        {
            advice: '🏡 Medium family energy: Be warm and clear. Show you care, but stay grounded.',
            prompt: `Write a warm, respectful reply to my family member's ${promptTone}. Keep it genuine and calm.`
        },
        {
            advice: '🏡 High family energy: Be caring and slightly more expressive. Show empathy and clarity.',
            prompt: `Write a thoughtful, caring response to my family member's ${promptTone}. Keep it honest and kind.`
        },
        {
            advice: '🏡 Maximum family energy: Be warm, open, and reassuring. Show heart while staying respectful.',
            prompt: `Write a warm, sincere reply to my family member's ${promptTone}. Keep it thoughtful and heartfelt.`
        }
    ];

    const exPrompts = [
        {
            advice: '💔 Very low ex energy: Be calm, neutral, and brief. Keep it respectful and guarded.',
            prompt: `Write a short, neutral reply to my ex's ${promptTone}${promptSubject}. Keep it polite and unemotional.`
        },
        {
            advice: '💔 Low ex energy: Be careful and sincere. Keep the tone respectful without reopening old wounds.',
            prompt: `Write a respectful reply to my ex's ${promptTone}. Keep it honest and composed.`
        },
        {
            advice: '💔 Medium ex energy: Maintain boundaries but stay kind. Avoid drama and keep it clear.',
            prompt: `Write a balanced reply to my ex's ${promptTone}. Keep it calm, direct, and respectful.`
        },
        {
            advice: '💔 High ex energy: Be friendly but guarded. Keep your response thoughtful and firm if needed.',
            prompt: `Write a considerate reply to my ex's ${promptTone}. Keep it polite and controlled.`
        },
        {
            advice: '💔 Maximum ex energy: Be composed and boundary-minded. This should sound respectful and intentional.',
            prompt: `Write a composed and respectful reply to my ex's ${promptTone}. Keep it clear, concise, and calm.`
        }
    ];

    const potentialDatePrompts = [
        {
            advice: '🌙 Very low potential-date energy: Keep it gentle and light. Make it easy to respond to.',
            prompt: `Write a gentle reply to a potential date's ${promptTone}${promptSubject}. Keep it short, warm, and low-pressure.`
        },
        {
            advice: '🌙 Low potential-date energy: Be friendly and curious without overcommitting.',
            prompt: `Write a friendly response to a potential date's ${promptTone}. Keep it open and easygoing.`
        },
        {
            advice: '🌙 Medium potential-date energy: Show interest while staying casual. Keep it confident.',
            prompt: `Write a warm, curious reply to a potential date's ${promptTone}. Keep it inviting and natural.`
        },
        {
            advice: '🌙 High potential-date energy: Be flirty and engaged. Show you want to keep the conversation going.',
            prompt: `Write a flirty, engaging reply to a potential date's ${promptTone}. Keep it playful and confident.`
        },
        {
            advice: '🌙 Maximum potential-date energy: Be bold and charming. This should feel fun and confident.',
            prompt: `Write a confident, flirty reply to a potential date's ${promptTone}. Keep it upbeat and engaging.`
        }
    ];

    if (sender === 'crush') return makeResult(crushPrompts[category].advice, crushPrompts[category].prompt);
    if (sender === 'boss') return makeResult(bossPrompts[category].advice, bossPrompts[category].prompt);
    if (sender === 'friend') return makeResult(friendPrompts[category].advice, friendPrompts[category].prompt);
    if (sender === 'bestie') return makeResult(bestiePrompts[category].advice, bestiePrompts[category].prompt);
    if (sender === 'lover') return makeResult(loverPrompts[category].advice, loverPrompts[category].prompt);
    if (sender === 'family') return makeResult(familyPrompts[category].advice, familyPrompts[category].prompt);
    if (sender === 'ex') return makeResult(exPrompts[category].advice, exPrompts[category].prompt);
    if (sender === 'potential-date') return makeResult(potentialDatePrompts[category].advice, potentialDatePrompts[category].prompt);

    return makeResult('Use your best judgment.', `Write a thoughtful reply to a ${promptTone}. Keep it honest and appropriate.`);
}

function generateResult() {
    const systemDirective = 'Keep it under 2-3 sentences unless context demands more. Be authentic.';
    const result = generatePromptForEnergy(quizData.sender, quizData.tone, quizData.energy, quizData.customTone, quizData.message, quizData.toneStrength, quizData.phraseStyle, quizData.subject);
    const fullPrompt = `${result.prompt}\n\n${systemDirective}`;

    document.getElementById('strategy-text').textContent = result.advice;
    document.getElementById('ai-prompt-box').value = fullPrompt;
    renderSuggestedReplies(result.replies);

    latestResult = {
        sender: quizData.sender,
        tone: quizData.tone,
        subject: quizData.subject,
        customTone: quizData.customTone,
        energy: quizData.energy,
        message: quizData.message,
        advice: result.advice,
        prompt: fullPrompt,
        replies: result.replies,
        timestamp: Date.now()
    };

    return latestResult;
}

// ============================================
// SHOW RESULT SCREEN
// ============================================
function showResultScreen() {
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach(step => step.classList.remove('active'));
    document.getElementById('result-screen').classList.add('active');
}

// ============================================
// INITIALIZE AFTER DOM IS READY
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    await loadReplyData();
    const choiceButtons = document.querySelectorAll('.choice-card');
    const energySlider = document.getElementById('energy-slider');
    const energyLevelLabel = document.getElementById('energy-level-label');
    const toneStrengthSlider = document.getElementById('tone-strength-slider');
    const toneStrengthLabel = document.getElementById('tone-strength-label');
    const phraseSelect = document.getElementById('phrase-style-select');
    const previewSelect = document.getElementById('preview-style-select');
    toneExample = document.getElementById('tone-example');
    customToneContainer = document.getElementById('custom-tone-container');
    customToneInput = document.getElementById('custom-tone-input');
    customToneHelper = document.getElementById('custom-tone-helper');
    const receivedMessageInput = document.getElementById('received-message');
    const submitBtn = document.getElementById('submitQuiz');
    const nextToSubjectBtn = document.getElementById('nextToSubject');
    const nextToEnergyBtn = document.getElementById('nextToEnergy');
    const backToSenderBtn = document.getElementById('backToSender');
    const backToToneBtn = document.getElementById('backToTone');
    const backToSubjectBtn = document.getElementById('backToSubject');
    const backFromResultBtn = document.getElementById('backFromResult');
    const copyFullBtn = document.getElementById('copy-full-btn');
    const saveHistoryBtn = document.getElementById('save-history-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const progressFill = document.getElementById('progressFill');
    const formSteps = document.querySelectorAll('.form-step');

    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.choice-card');
        if (!button) return;
        handleChoiceCardClick(button, formSteps, progressFill);
    });

    customToneInput.addEventListener('input', function() {
        quizData.customTone = this.value.trim();
    });

    customToneInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && this.value.trim().length > 0) {
            quizData.customTone = this.value.trim();
            moveToStep(3, formSteps, progressFill);
        }
    });

    receivedMessageInput.addEventListener('input', function() {
        quizData.message = this.value.trim();
    });

    nextToSubjectBtn.addEventListener('click', function() {
        if (!quizData.tone) {
            alert('Please choose a tone before continuing.');
            return;
        }

        if (quizData.tone === 'custom' && !quizData.customTone) {
            alert('Please describe your custom tone before continuing.');
            return;
        }

        moveToStep(3, formSteps, progressFill);
    });

    nextToEnergyBtn.addEventListener('click', function() {
        if (!quizData.subject) {
            alert('Please choose a subject before continuing.');
            return;
        }

        moveToStep(4, formSteps, progressFill);
    });

    energySlider.addEventListener('input', function() {
        quizData.energy = parseInt(this.value, 10);
        updateEnergyLabel(quizData.energy, energyLevelLabel);
    });

    if (toneStrengthSlider) {
        toneStrengthSlider.value = quizData.toneStrength;
        toneStrengthSlider.addEventListener('input', function() {
            quizData.toneStrength = parseInt(this.value, 10);
            if (toneStrengthLabel) {
                let level = 'Medium';
                const v = quizData.toneStrength;
                if (v < 30) level = 'Soft';
                else if (v > 70) level = 'Strong';
                toneStrengthLabel.textContent = `Tone: ${level} (${v}%)`;
            }
        });
    }

    if (phraseSelect) {
        phraseSelect.value = quizData.phraseStyle || 'auto';
        phraseSelect.addEventListener('change', function() {
            quizData.phraseStyle = this.value;
            if (document.getElementById('result-screen').classList.contains('active')) {
                applyPreviewStyle();
            }
        });
    }

    function applyPreviewStyle() {
        const style = (previewSelect && previewSelect.value) ? previewSelect.value : quizData.phraseStyle;
        const replies = getSampleReplies(quizData.sender, quizData.tone, quizData.customTone, quizData.message, quizData.energy, quizData.toneStrength, style, quizData.subject);
        renderSuggestedReplies(replies);
    }

    if (previewSelect) {
        previewSelect.value = 'auto';
        previewSelect.addEventListener('change', function() {
            applyPreviewStyle();
        });
    }

    // Back button handlers (force navigation without validation)
    if (backToSenderBtn) {
        backToSenderBtn.addEventListener('click', function() {
            moveToStepForced(1, formSteps, progressFill);
        });
    }
    if (backToToneBtn) {
        backToToneBtn.addEventListener('click', function() {
            moveToStepForced(2, formSteps, progressFill);
        });
    }
    if (backToSubjectBtn) {
        backToSubjectBtn.addEventListener('click', function() {
            moveToStepForced(3, formSteps, progressFill);
        });
    }
    if (backFromResultBtn) {
        backFromResultBtn.addEventListener('click', function() {
            moveToStepForced(4, formSteps, progressFill);
        });
    }

    submitBtn.addEventListener('click', async function() {
        if (!quizData.sender || !quizData.tone || !quizData.subject || quizData.energy === null) {
            alert('Please complete all steps before submitting!');
            return;
        }

        if (quizData.tone === 'custom' && !quizData.customTone) {
            alert('Please describe the custom tone before submitting.');
            return;
        }

        const result = generateResult();
        renderSuggestedReplies(result.replies);
        showResultScreen();

        saveHistoryItem(result);
        renderHistory();
    });

    document.getElementById('copy-prompt-btn').addEventListener('click', function() {
        const textArea = document.getElementById('ai-prompt-box');
        textArea.select();

        navigator.clipboard.writeText(textArea.value).then(() => {
            const originalText = this.textContent;
            this.textContent = '✅ Copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        }).catch(err => {
            alert('Failed to copy. Please try again.');
            console.error('Copy error:', err);
        });
    });

    copyFullBtn.addEventListener('click', function() {
        copyFullPackage();
    });

    // Handle per-reply copy buttons via event delegation
    const replySamplesContainer = document.getElementById('reply-samples');
    if (replySamplesContainer) {
        replySamplesContainer.addEventListener('click', function(e) {
            const btn = e.target.closest('.copy-reply-btn');
            if (!btn) return;
            const sample = btn.closest('.reply-sample');
            if (!sample) return;
            const textEl = sample.querySelector('p');
            const text = textEl ? textEl.textContent.trim() : '';
            copyReply(text, btn).then(() => {
                // animated feedback: change button, show tooltip
                const original = btn.innerHTML;
                btn.innerHTML = '✅ Copied';
                btn.disabled = true;
                btn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    btn.style.transform = '';
                }, 1400);

                // floating tooltip near button
                try {
                    const rect = btn.getBoundingClientRect();
                    const tip = document.createElement('div');
                    tip.textContent = 'Copied!';
                    tip.style.position = 'fixed';
                    tip.style.left = (rect.left + rect.width / 2) + 'px';
                    tip.style.top = (rect.top - 10) + 'px';
                    tip.style.padding = '6px 10px';
                    tip.style.background = 'rgba(0,0,0,0.85)';
                    tip.style.color = '#fff';
                    tip.style.borderRadius = '6px';
                    tip.style.transform = 'translate(-50%, -100%)';
                    tip.style.zIndex = 9999;
                    tip.style.opacity = '1';
                    tip.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    document.body.appendChild(tip);
                    requestAnimationFrame(() => {
                        tip.style.opacity = '0';
                        tip.style.transform = 'translate(-50%, -140%)';
                    });
                    setTimeout(() => { document.body.removeChild(tip); }, 800);
                } catch (err) {
                    // ignore
                }
            }).catch(() => {
                // failure feedback
                const orig = btn.innerHTML;
                btn.innerHTML = 'Copy failed';
                setTimeout(() => btn.innerHTML = orig, 1200);
            });
        });
    }

    saveHistoryBtn.addEventListener('click', function() {
        if (!latestResult) {
            alert('Generate a result first to save it.');
            return;
        }
        saveHistoryItem(latestResult);
        renderHistory();
        alert('Reply saved to history.');
    });

    clearHistoryBtn.addEventListener('click', function() {
        clearHistory();
    });

    renderHistory();
    updateEnergyLabel(quizData.energy, energyLevelLabel);

    console.log('App initialized');
});