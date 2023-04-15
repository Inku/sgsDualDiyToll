WebFont.load({
    custom: {
        families: ['HanYiTianMaXing', 'SIMLI', 'JinMeiMaoCao', 'HuaKangXinZhuan']
    },
    fontactive: function (familyName, fvd) {
        console.log('Font "' + familyName + '" has loaded.');
    },
    active: function () {
        console.log('All fonts have loaded.');
    }
});

const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('input', drawCard);
});

const canvas = document.getElementById('card-canvas');

const qiBingInput = document.getElementById('qi-bing');
const qiBingList = document.getElementById('qi-bing-list');
const qiBings = [];
const qiBingMap = { "杀": "殺", "闪": "閃" }

qiBingInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (this.value.trim() !== '') {
            let qibing = this.value.trim();
            let fan = qiBingMap[qibing];
            if (fan != undefined && fan.length > 0) {
                qibing = fan;
            }
            qiBings.push(qibing);
            updateqiBingList();
            this.value = '';
        }
    }
});

function updateqiBingList() {
    qiBingList.innerHTML = qiBings.map((qiBing, index) => `<span draggable="true" ondragstart="dragStart(event, ${index})">${qiBing} <button class="qi-bing-remove-btn" type="button" onclick="removeqiBing(${index})">删除</button></span>`).join('');
    drawCard();
}

qiBingList.addEventListener('dragover', (event) => {
    event.preventDefault();
});

qiBingList.addEventListener('drop', (event) => {
    event.preventDefault();
    const targetIndex = Array.from(qiBingList.children).indexOf(event.target);
    if (draggedIndex !== targetIndex) {
        qiBings.splice(targetIndex, 0, qiBings.splice(draggedIndex, 1)[0]);
        updateqiBingList();
    }
});

let draggedIndex = null;

function dragStart(event, index) {
    draggedIndex = index;
    event.dataTransfer.effectAllowed = 'move';
}

function removeqiBing(index) {
    qiBings.splice(index, 1);
    updateqiBingList();
}

function removeElementsByClass(className) {
    let elements = document.getElementsByClassName(className);
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
    drawCardTitle(ctx, document.getElementById('title').value);
    drawCardScore(ctx, document.getElementById('score').value);
    drawCardSkills(ctx, document.getElementById('card-skills'));
    drawCardQibing(ctx, qiBings);

    const faction = document.querySelector('input[name="faction"]:checked').value;
    const health = document.getElementById('health').value;

    document.getElementById('card-faction').innerText = `势力：${faction}`;
    document.getElementById('card-health').innerText = `体力：${health}`;

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
    let x = 130;
    let yStart = 400;
    let yOffset = 100;
    ctx.font = "90px JinMeiMaoCao";

    //绘制阴影
    ctx.shadowColor = "rgba(41, 66, 73, 1)"; // 设置阴影颜色为黑色
    ctx.shadowBlur = 0; // 设置阴影模糊程度
    ctx.shadowOffsetX = 6; // 水平偏移量设置为0
    ctx.shadowOffsetY = 9; // 垂直偏移量设置为0
    for (let i = 0; i < name.length; i++) {
        ctx.fillText(name[i], x, yStart + yOffset * i);
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0)";

    //外侧两像素白色描边
    ctx.lineWidth = 10;
    ctx.strokeStyle = "white";
    for (let i = 0; i < name.length; i++) {
        ctx.strokeText(name[i], x, yStart + yOffset * i);
    }

    //黑色底色
    ctx.lineWidth = 8;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    for (let i = 0; i < name.length; i++) {
        ctx.strokeText(name[i], x, yStart + yOffset * i);
        ctx.fillText(name[i], x, yStart + yOffset * i);
    }

    //前景白色
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    for (let i = 0; i < name.length; i++) {
        ctx.fillText(name[i], x, yStart + yOffset * i);
    }
}

function drawCardTitle(ctx, title) {
    let x = 80;
    let yStart = 285;
    let yOffset = 45;
    ctx.font = "45px HuaKangXinZhuan";

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    for (let i = 0; i < title.length; i++) {
        ctx.fillText(title[i], x, yStart + yOffset * i);
    }
}

function drawCardScore(ctx, score) {
    let x = 120;
    let y = 190;
    ctx.font = "160px HanYiTianMaXing";

    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.strokeText(score, x, y);
    ctx.fillText(score, x, y);
}

function drawCardSkills(ctx, skills){

}

function drawCardQibing(ctx, qiBings) {
    ctx.font = "110px SIMLI";

    let xStart = 830;
    let xOffset = 130;
    let y = 137;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    for (let i = 0; i < qiBings.length; i++) {
        ctx.strokeText(qiBings[i], xStart - i * xOffset, y);
        ctx.fillText(qiBings[i], xStart - i * xOffset, y);
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
                    <label class="radio-label"><input type="radio" name="skill-type-${index}" value="普通技能" checked onchange="updateSkill(${index}, 'type', this.value)"> 普通技能</label>
                    <label class="radio-label"><input type="radio" name="skill-type-${index}" value="伏击技能" onchange="updateSkill(${index}, 'type', this.value)"> 伏击技能</label>
                    <br>
                    <label class="radio-label"><input type="radio" name="skill-trigger-${index}" value="触发" checked onchange="updateSkill(${index}, 'trigger', this.value)"> 触发</label>
                    <label class="radio-label"><input type="radio" name="skill-trigger-${index}" value="主动" onchange="updateSkill(${index}, 'trigger', this.value)"> 主动</label>
                    <label class="radio-label"><input type="radio" name="skill-trigger-${index}" value="持续" onchange="updateSkill(${index}, 'trigger', this.value)"> 持续</label>
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

window.onload = function () {
    drawCard();
};