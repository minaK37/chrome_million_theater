// 1️⃣ ページのテキストノードを収集
function collectTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    let node;
    while (node = walker.nextNode()) {
        nodes.push(node);
    }
    return nodes;
}

// 2️⃣ 文字列にマッチするか判定する
// rules は { "hello": "<mark style='background: yellow;'>hello</mark>", ... } の形
function matchText(text, rules) {
    const matches = [];
    for (const key in rules) {
        if (text.includes(key)) {
            matches.push(key);
        }
    }
    return matches;
}

// 3️⃣ テキストノードを置換
function replaceTextNode(textNode, rules) {
    let html = textNode.nodeValue;
    for (const key in rules) {
        const replacement = rules[key];
        // 正規表現を使ってすべて置換
        const regex = new RegExp(key, "g");
        html = html.replace(regex, replacement);
    }
    const span = document.createElement("span");
    span.innerHTML = html;
    textNode.parentNode.replaceChild(span, textNode);
}

// 4️⃣ メイン処理
function highlightWords() {
    const rules = {
        "hello": "<mark style='background: yellow;'>hello</mark>",
        "world": "<span style='color: red;'>world</span>"
    };

    const nodes = collectTextNodes(document.body);

    // マッチするノードだけ処理
    for (const node of nodes) {
        const matchedKeys = matchText(node.nodeValue, rules);
        if (matchedKeys.length > 0) {
            replaceTextNode(node, rules);
        }
    }
}

// 実行
highlightWords();



function findRandomImage() {
    probability = 0.7;

    const images = Array.from(document.images);

    // src に "svg" を含むものを除外
    const filtered = images.filter(img => {
        const src = (img.src || "").toLowerCase();
        return !src.includes("svg");
    });

    if (filtered.length === 0) return null;

    // 確率判定：指定確率未満なら「処理しない」
    if (Math.random() > probability) {
        return null;
    }

    // ランダム抽選
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
}


function overlayImage(baseImg) {
    if (!baseImg) return;

    const parent = baseImg.parentElement;
    const parentStyle = getComputedStyle(parent);
    if (parentStyle.position === "static") {
        parent.style.position = "relative";
    }

    const overlay = document.createElement("img");
    overlay.src = chrome.runtime.getURL("img/mascot.png");

    const rect = baseImg.getBoundingClientRect();

    // 縦横のうち小さい方を基準に50%サイズに縮小
    const scale = 0.5;
    const minSide = Math.min(rect.width, rect.height);
    const overlaySize = minSide * scale;

    overlay.style.position = "absolute";
    overlay.style.width = overlaySize + "px";
    overlay.style.height = overlaySize + "px";
    overlay.style.left = "0px";
    overlay.style.bottom = "0px";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = 1000;

    parent.appendChild(overlay);
}


// 3️⃣ メイン処理
function addOverlayToLargestImage() {
    const largest = findRandomImage();
    overlayImage(largest, "img/mascot.png"); // サンプル画像
}

// 実行
addOverlayToLargestImage();

