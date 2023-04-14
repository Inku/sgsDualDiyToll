const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('input', drawCard);
});

const canvas = document.getElementById('card-canvas');

const qiBingInput = document.getElementById('qi-bing');
const qiBingList = document.getElementById('qi-bing-list');
const qiBings = [];

qiBingInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (this.value.trim() !== '') {
            qiBings.push(this.value.trim());
            updateqiBingList();
            this.value = '';
        }
    }
});

window.onload = function () {
    drawCard();
};

function updateqiBingList() {
    qiBingList.innerHTML = qiBings.map((qiBing, index) => `<span>${qiBing} <button type="button" onclick="removeqiBing(${index})">删除</button></span>`).join('');
    drawCard();
}

function removeqiBing(index) {
    qiBings.splice(index, 1);
    updateqiBingList();
}

function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    // 遍历元素并从其父元素中删除它们
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function drawCard() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    const card = document.getElementById('card');


    drawCardName(ctx, document.getElementById('name').value);

    const faction = document.querySelector('input[name="faction"]:checked').value;
    const score = document.getElementById('score').value;
    const health = document.getElementById('health').value;
    const title = document.getElementById('title').value;

    document.getElementById('card-faction').innerText = `势力：${faction}`;
    document.getElementById('card-score').innerText = `分数：${score}`;
    document.getElementById('card-health').innerText = `体力：${health}`;
    document.getElementById('card-title').innerText = title;

    const cardSkills = document.getElementById('card-skills');
    cardSkills.innerHTML = '';
    if (skills.length > 0) {
        skills.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${skill.name}</strong> (${skill.type}, ${skill.trigger}, 发动次数: ${skill.count})<br>
                ${skill.description}
            `;
            cardSkills.appendChild(li);
        });
    }
}


function drawCardName(ctx, name) {
    const x = 90;
    const yStart = 280;
    const yOffset = 100;

    //先画黑色底色
    ctx.font = "95px JinMeiMaoCao";
    ctx.lineWidth = 9;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    for (let i = 0; i < name.length; i++) {
        ctx.strokeText(name[i], x, yStart + yOffset * i);
        ctx.fillText(name[i], x, yStart + yOffset * i);
    }

    //先画前景白色
    ctx.font = "95px JinMeiMaoCao";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    for (let i = 0; i < name.length; i++) {
        ctx.fillText(name[i], x, yStart + yOffset * i);
    }
}

// 技能相关代码
const skills = [];
const skillList = document.getElementById('skill-list');
const addSkillButton = document.getElementById('add-skill');

addSkillButton.addEventListener('click', () => {
    const newSkill = {
        type: '普通技能',
        trigger: '触发',
        count: 1,
        name: '',
        description: '',
    };
    skills.push(newSkill);
    updateSkillList();
});

function updateSkill(index, key, value) {
    skills[index][key] = value;
    drawCard();
}

function removeSkill(index) {
    skills.splice(index, 1);
    updateSkillList();
}


function updateSkillList() {
    skillList.innerHTML = skills.map((skill, index) => {
        return `
            <div>
                <fieldset>
                    <legend>技能 ${index + 1}</legend>
                    <label><input type="radio" name="skill-type-${index}" value="普通技能" checked onchange="updateSkill(${index}, 'type', this.value)"> 普通技能</label>
                    <label><input type="radio" name="skill-type-${index}" value="伏击技能" onchange="updateSkill(${index}, 'type', this.value)"> 伏击技能</label>
                    <br>
                    <label><input type="radio" name="skill-trigger-${index}" value="触发" checked onchange="updateSkill(${index}, 'trigger', this.value)"> 触发</label>
                    <label><input type="radio" name="skill-trigger-${index}" value="主动" onchange="updateSkill(${index}, 'trigger', this.value)"> 主动</label>
                    <label><input type="radio" name="skill-trigger-${index}" value="持续" onchange="updateSkill(${index}, 'trigger', this.value)"> 持续</label>
                    <br>
                    <label>发动次数:</label>
                    <label><input type="checkbox" id="skill-count-toggle-${index}" onchange="toggleSkillCount(${index})" ${skill.countEnabled ? 'checked' : ''}> </label>
                    <input type="number" id="skill-count-${index}" value="${skill.count}" onchange="updateSkill(${index}, 'count', this.value)" ${skill.countEnabled ? '' : 'disabled'}>
                    <br>
                    <label for="skill-name-${index}">技能名称:</label>
                    <input type="text" id="skill-name-${index}" value="${skill.name}" onchange="updateSkill(${index}, 'name', this.value)">
                    <br>
                    <label for="skill-description-${index}">技能描述:</label>
                    <input type="text" id="skill-description-${index}" value="${skill.description}" onchange="updateSkill(${index}, 'description', this.value)">
                    <br>
                    <button type="button" onclick="removeSkill(${index})">删除技能</button>
                </fieldset>
            </div>
        `;
    }).join('');
    drawCard();
}

function toggleSkillCount(index) {
    const toggle = document.getElementById(`skill-count-toggle-${index}`);
    const input = document.getElementById(`skill-count-${index}`);
    if (toggle.checked) {
        input.removeAttribute('disabled');
        input.value = 1;
        updateSkill(index, 'count', 1);
    } else {
        input.setAttribute('disabled', true);
        input.value = '';
        updateSkill(index, 'count', null);
    }
}

function uploadImage(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const card = document.getElementById('card');
            if (card) {
                card.style.backgroundImage = `url(${e.target.result})`;
            } else {
                console.error('Card element not found.');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}
