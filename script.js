WebFont.load({
    custom: {
        families: ['HanYiTianMaXing', 'SIMLI', 'JinMeiMaoCao', 'HuaKangXinZhuan', 'HanYiZhongYuan']
    },
    fontactive: function (familyName, fvd) {
        console.log('Font "' + familyName + '" has loaded.');
    },
    active: function () {
        console.log('All fonts have loaded.');
    }
});

const canvas = document.getElementById('card-canvas');
const canvasWidth = parseInt(canvas.getAttribute("width"), 10);
const canvasHeight = parseInt(canvas.getAttribute("height"), 10);

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

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, canvasHeight - 96, canvasWidth, 96);

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
    const x = 120;
    const y = 195;
    ctx.font = "160px HanYiTianMaXing";

    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.strokeText(score, x, y);
    ctx.fillText(score, x, y);
}

function drawCardSkills(ctx, skills, faction) {
    const maxWidth = 57;//最大边缘宽度
    const minWidth = 15;//最小边缘宽度

    const maxMaskY = 957;//遮罩最低高度
    const bottomMaskY = canvasHeight - 96;//遮罩区最低处Y坐标

    //计算技能文字区域总体高度
    let textAreaHeight = 0;
    if (skills.length > 0) {
        skills.forEach(skill => {
            textAreaHeight += getSkillAreaHeight(ctx, skill);
            textAreaHeight += 2 * minWidth;//多个技能时增加两倍最小间距
        });
        textAreaHeight -= 2 * minWidth;
    }

    //顶部边缘宽度
    let topEdge;
    //遮罩区起始Y坐标
    let startY

    if (textAreaHeight <= (bottomMaskY - maxMaskY - 2 * maxWidth)) {
        //技能区域小于最小宽度：使用最大边缘宽度
        startY = maxMaskY;
        topEdge = maxWidth;
    } else if (textAreaHeight > (bottomMaskY - maxMaskY - 2 * maxWidth) && textAreaHeight <= (bottomMaskY - maxMaskY - 2 * minWidth)) {
        //技能区域大于最小宽度，小于未扩展最大宽度：均分上下边框宽度
        startY = maxMaskY;
        topEdge = (bottomMaskY - maxMaskY - textAreaHeight) / 2;
    } else {
        //技能区域大于未扩展最大宽度：向上扩展起始Y坐标
        startY = maxMaskY - (textAreaHeight - (bottomMaskY - maxMaskY - 2 * minWidth));
        topEdge = (bottomMaskY - startY - textAreaHeight) / 2;
    }

    for (let i = 0; i < skills.length; i++) {
        let skill = skills[i];

        let skillHeight = getSkillAreaHeight(ctx, skill);

        let maskEndY;
        if (i == skills.length - 1) {
            //最后一个遮罩区覆盖剩余部分   
            maskEndY = canvasHeight;
        } else {
            maskEndY = startY + topEdge + skillHeight + minWidth;
        }
        drawCardSkillMask(ctx, startY, maskEndY, i);
        drawSkillName(ctx, skill, faction, startY, topEdge);
        drawSkillTrigger(ctx, skill, startY, topEdge);
        drawSkillDetail(ctx, skill, startY, topEdge, true);
        startY = maskEndY;
        topEdge = minWidth;
    }
}

function drawCardSkillMask(ctx, startY, maskEndY, i) {
    if (i % 2 == 0) {
        ctx.globalAlpha = 0.6;
    } else {
        ctx.globalAlpha = 0.8;
    }
    ctx.fillStyle = 'white';
    ctx.fillRect(0, startY, canvasWidth, maskEndY - startY);
    ctx.globalAlpha = 1;
}

const factionLineColor = {
    "wei": "rgb(24, 97, 153)", "shu": "rgb(162, 49, 27)", "wu": "rgb(42, 125, 42)", "qun": "rgb(130, 118, 93)"
}

function drawSkillName(ctx, skill, faction, startY, topEdge) {
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
    let start = { "x": 57, "y": startY + topEdge };

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
    let x = 111;
    let y = startY + topEdge + 31;
    ctx.font = "37px SIMLI";
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.fillText(skill.name, x, y);
}

function drawSkillTrigger(ctx, skill, startY, topEdge) {
    let backgroundColor = { "触发": "rgb(55, 100, 200)", "主动": "rgb(175, 0, 0)", "持续": "rgb(41, 129, 74)" }
    let nums = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"]

    //计算文字宽度
    ctx.font = "37px HanYiZhongYuan";
    let text = skill.trigger;
    if (skill.count > 0) {
        text += nums[skill.count - 1];
    }
    let textWidth = ctx.measureText(text).width;

    //绘制矩形
    let x = 211;
    let y = startY + topEdge - 2;
    let width = textWidth + 46;
    let height = 41;

    ctx.fillStyle = backgroundColor[skill.trigger];
    ctx.fillRect(x, y, width, height);

    //绘制半圆
    ctx.beginPath();
    ctx.arc(x + 6, y + height / 2, 18, Math.PI / 2, Math.PI * 1.5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + width - 6, y + height / 2, 18, Math.PI * 1.5, Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    //文字绘制
    //起始坐标
    let textX = 193;
    let textY = startY + topEdge + 31;

    ctx.fillStyle = "white";
    ctx.textAlign = "left";

    ctx.font = "37px Arial";
    ctx.fillText("【", textX, textY);

    ctx.font = "37px HanYiZhongYuan";
    ctx.fillText(text, textX + 41, textY);

    ctx.font = "37px Arial";
    ctx.fillText("】", textX + 45 + textWidth, textY);
}

function drawSkillDetail(ctx, skill, startY, topEdge, fillText) {
    ctx.textAlign = "left";
    let sideEdgeWidth = 57;
    let beginX = 351;
    let beginY = startY + topEdge + 29;
    if (skill.count > 0) {
        beginX += 37;//发动次数像素偏移
    }
    let lineNum = 1;
    for (let i = 0; i < skill.description.length;) {
        //重置文字样式
        ctx.font = "37px HanYiZhongYuan";
        ctx.fillStyle = "black";

        let char = skill.description[i];
        let text = char;
        if (char == "{") {
            for (let j = i + 1; j < skill.description.length; j++) {
                text += skill.description[j];
                if (skill.description[j] == "}")
                    break;
            }
        }
        i += text.length;

        if (text == "{黑色}") {
            ctx.font = "bold 37px HanYiZhongYuan";
            ctx.fillStyle = "black";
            text = "黑色"
        } else if (text == "{红色}") {
            ctx.font = "bold 37px HanYiZhongYuan";
            ctx.fillStyle = "rgb(240, 0, 0)";
            text = "红色"
        }
        //TODO 判定结果绘图

        for (let j = 0; j < text.length; j++) {
            let position = getTextBounds(ctx, text[j], beginX, beginY);
            //超宽换行
            if (position.x + position.width > canvasWidth - sideEdgeWidth) {
                beginX = sideEdgeWidth;
                beginY = position.y + position.height + 50;//行高13+字体37像素
                lineNum++;
            }
            position = getTextBounds(ctx, text[j], beginX, beginY);
            if (fillText) {
                ctx.fillText(text[j], beginX, beginY);
            }
            beginX = position.x + position.width;
        }
    }
    return lineNum;
}

function getSkillAreaHeight(ctx, skill) {
    let lineNum = drawSkillDetail(ctx, skill, 0, 0, false);
    return lineNum * 37 + (lineNum - 1) * 13;//行高
}

function getTextBounds(ctx, text, x, y) {
    var metrics = ctx.measureText(text);
    var width = metrics.width;
    var height = 37;

    return {
        x: x,
        y: y - height,
        width: width,
        height: height
    };
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
    // 显示自定义确认对话框
    const confirmDialog = document.getElementById('confirm-dialog');
    confirmDialog.classList.remove('hidden');

    // 获取确定按钮和取消按钮
    const confirmYesButton = document.getElementById('confirm-yes');
    const confirmNoButton = document.getElementById('confirm-no');

    // 移除旧的事件监听器
    confirmYesButton.onclick = null;
    confirmNoButton.onclick = null;

    // 为确定按钮添加新的事件监听器
    confirmYesButton.onclick = function () {
        console.log("remove:", index);
        skills.splice(index, 1);
        updateSkillList();
        confirmDialog.classList.add('hidden');
    };

    // 为取消按钮添加新的事件监听器
    confirmNoButton.onclick = function () {
        confirmDialog.classList.add('hidden');
    };
}


function updateSkillList() {
    skillList.innerHTML = skills.map((skill, index) => {
        return `
            <div>
                <fieldset>
                    <legend>技能 ${index + 1}</legend>
                    <label for="skill-name-${index}">技能名称:</label>
                    <input type="text" id="skill-name-${index}" value="${skill.name}" oninput="updateSkill(${index}, 'name', this.value)">
                    <br>
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
                    <label for="skill-description-${index}">技能描述:</label>
                    <br>
                    <textarea rows="3" id="skill-description-${index}" value="${skill.description}" oninput="updateSkill(${index}, 'description', this.value)">${skill.description}</textarea>
                    <br>
                    <div id="preset-buttons">
                        <button type="button" id="btn1" onclick="appendTextToSkillDescription(${index},'{黑色}')">黑色</button>
                        <button type="button" id="btn1" onclick="appendTextToSkillDescription(${index},'{红色}')">红色</button>
                        <button type="button" id="btn1" onclick="appendTextToSkillDescription(${index},'{青龙}')">黑桃/青龙</button>
                        <button type="button" id="btn1" onclick="appendTextToSkillDescription(${index},'{白虎}')">草花/白虎</button>
                        <button type="button" id="btn1" onclick="appendTextToSkillDescription(${index},'{朱雀}')">红桃/朱雀</button>
                        <button type="button" id="btn1" onclick="appendTextToSkillDescription(${index},'{玄武}')">方块/玄武</button>
                    </div>
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

function appendTextToSkillDescription(index, text) {
    const skillDescription = document.getElementById(`skill-description-${index}`);
    skillDescription.value += text;
    updateSkill(index, 'description', skillDescription.value);
}

window.onload = function () {
    drawCard();
};