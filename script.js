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

const canvas = document.getElementById('card-canvas');

const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('input', drawCard);
});

function resetShadow(ctx) {
    ctx.shadowColor = 'transparent'; // 清除阴影颜色
    ctx.shadowOffsetX = 0; // 清除阴影在x轴方向上的偏移量
    ctx.shadowOffsetY = 0; // 清除阴影在y轴方向上的偏移量
    ctx.shadowBlur = 0; // 清除阴影的模糊程度    
}

function drawCard() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const card = document.getElementById('card');

    const faction = document.querySelector('input[name="faction"]:checked').value;
    const health = document.getElementById('health').value;

    drawCardName(ctx, document.getElementById('name').value);
    drawCardTitle(ctx, document.getElementById('title').value);
    drawCardScore(ctx, document.getElementById('score').value);
    drawCardSkills(ctx, skills, faction);
    drawCardQibing(ctx, qiBings);
}

function drawCardName(ctx, name) {
    let x = 131;
    let yStart = 397;
    let yOffset = 108;
    ctx.font = "91px JinMeiMaoCao";

    //绘制阴影
    ctx.shadowColor = "rgba(41, 66, 73, 1)"; // 设置阴影颜色
    ctx.shadowBlur = 0; // 设置阴影模糊程度
    ctx.shadowOffsetX = 6; // 水平偏移量
    ctx.shadowOffsetY = 9; // 垂直偏移量
    for (let i = 0; i < name.length; i++) {
        ctx.fillText(name[i], x, yStart + yOffset * i);
    }
    resetShadow(ctx);

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
    let x = 82;
    let yStart = 280;
    let yOffset = 46;
    ctx.font = "42px HuaKangXinZhuan";

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    for (let i = 0; i < title.length; i++) {
        ctx.fillText(title[i], x, yStart + yOffset * i);
    }
}

function drawCardScore(ctx, score) {
    let x = 120;
    let y = 195;
    ctx.font = "160px HanYiTianMaXing";

    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.strokeText(score, x, y);
    ctx.fillText(score, x, y);
}

function drawCardSkills(ctx, skills, faction) {
    if (skills.length > 0) {
        skills.forEach(skill => {
            drawSkillName(ctx, skill, faction)
        });
    }
}

const factionLineColor = {
    "wei": "rgb(24, 97, 153)", "shu": "rgb(162, 49, 27)", "wu": "rgb(42, 125, 42)", "qun": "rgb(130, 118, 93)"
}
function drawSkillName(ctx, skill, faction) {
    let backgroundColor = "black";
    let lineColor = "white";
    let fontColor = "white";

    if (skill.type == "normal") {
        backgroundColor = "rgb(250, 236, 193)";
        lineColor = factionLineColor[faction];
        fontColor = "black";
    }

    //技能底框
    //起始坐标
    let start = { "x": 57, "y": 1014 };

    //技能标签属性
    let width = 110;
    let height = 38;
    //最右侧顶点额外宽度
    let triangleWidth = 18;

    let top = { "x": start.x + width, "y": start.y };
    let bottom = { "x": start.x + width, "y": start.y + height };
    let right = { "x": start.x + width + triangleWidth, "y": start.y + height / 2 };

    //阴影属性
    ctx.shadowColor = "black"; // 设置阴影颜色
    ctx.shadowBlur = 10; // 设置阴影模糊程度
    ctx.shadowOffsetX = 0; // 水平偏移量
    ctx.shadowOffsetY = 0; // 垂直偏移量

    ctx.fillStyle = backgroundColor;
    ctx.beginPath(); // 开始路径
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(start.x, start.y + height);
    ctx.closePath();
    ctx.fill();
    resetShadow(ctx);

    //内标三角
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(right.x - triangleWidth, right.y);
    ctx.lineTo(right.x - triangleWidth - 7, right.y - 7);
    ctx.lineTo(right.x - triangleWidth - 7, right.y + 7);
    ctx.closePath();
    ctx.fill();

    //标线绘制
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath(); // 开始路径
    ctx.moveTo(start.x + 5, start.y); // 移动到起点
    ctx.lineTo(start.x + 5, start.y + height); // 从起点连接到终点
    ctx.stroke(); // 绘制路径

    ctx.beginPath();
    ctx.moveTo(start.x, start.y + 5);
    ctx.lineTo(top.x - 5, top.y + 5);
    ctx.lineTo(right.x - 10, right.y);
    ctx.lineTo(bottom.x - 5, bottom.y - 5);
    ctx.lineTo(start.x, start.y + height - 5);
    ctx.stroke();

    //文字绘制
    //起始坐标
    x = 111;
    y = 1045;
    ctx.font = "37px SIMLI";
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.fillText(skill.name, x, y);
}

function drawCardQibing(ctx, qiBings) {
    ctx.font = "112px SIMLI";

    let xStart = 834;
    let xOffset = 130;
    let y = 139;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    for (let i = 0; i < qiBings.length; i++) {
        ctx.strokeText(qiBings[i], xStart - i * xOffset, y);
        ctx.fillText(qiBings[i], xStart - i * xOffset, y);
    }
}

//奇兵事件处理
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

// 技能事件处理
const skills = [];
const skillList = document.getElementById('skill-list');
const addSkillButton = document.getElementById('add-skill');

addSkillButton.addEventListener('click', () => {
    const newSkill = {
        type: 'normal',
        trigger: '触发',
        count: '',
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
                    <label class="radio-label"><input type="radio" name="skill-type-${index}" value="normal" checked oninput="updateSkill(${index}, 'type', this.value)"> 普通技能</label>
                    <label class="radio-label"><input type="radio" name="skill-type-${index}" value="ambush" oninput="updateSkill(${index}, 'type', this.value)"> 伏击技能</label>
                    <br>
                    <label class="radio-label"><input type="radio" name="skill-trigger-${index}" value="触发" checked oninput="updateSkill(${index}, 'trigger', this.value)"> 触发</label>
                    <label class="radio-label"><input type="radio" name="skill-trigger-${index}" value="主动" oninput="updateSkill(${index}, 'trigger', this.value)"> 主动</label>
                    <label class="radio-label"><input type="radio" name="skill-trigger-${index}" value="持续" oninput="updateSkill(${index}, 'trigger', this.value)"> 持续</label>
                    <br>
                    <label>发动次数:</label>
                    <label><input type="checkbox" id="skill-count-toggle-${index}" oninput="toggleSkillCount(${index})" ${skill.countEnabled ? 'checked' : ''}> </label>
                    <input type="number" id="skill-count-${index}" value="${skill.count}" oninput="updateSkill(${index}, 'count', this.value)" ${skill.countEnabled ? '' : 'disabled'}>
                    <br>
                    <label for="skill-name-${index}">技能名称:</label>
                    <input type="text" id="skill-name-${index}" value="${skill.name}" oninput="updateSkill(${index}, 'name', this.value)">
                    <br>
                    <label for="skill-description-${index}">技能描述:</label>
                    <input type="text" id="skill-description-${index}" value="${skill.description}" oninput="updateSkill(${index}, 'description', this.value)">
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