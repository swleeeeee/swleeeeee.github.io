// 自定义 KaTeX 预处理函数，修复转义问题
function preprocessMath(text) {
    // 修复常见的 HTML 转义
    text = text.replace(/&amp;/g, '&');           // 修复 & 转义
    text = text.replace(/&lt;/g, '<');            // 修复 < 转义
    text = text.replace(/&gt;/g, '>');            // 修复 > 转义
    text = text.replace(/&quot;/g, '"');          // 修复 " 转义
    text = text.replace(/&#x27;/g, "'");          // 修复 ' 转义
    text = text.replace(/&#x2F;/g, '/');          // 修复 / 转义
    
    // 修复 Hugo 编译导致的 LaTeX 命令丢失问题
    text = text.replace(/(?<!\\)\\(?!\\)/g, '\\\\');  // 单个 \ 变成 \\
    text = text.replace(/(?<!\\){/g, '\\{');          // 单独的 { 变成 \{
    text = text.replace(/(?<!\\)}/g, '\\}');          // 单独的 } 变成 \}
    
    // 修复其他 LaTeX 命令中的转义
    text = text.replace(/\\&amp;lt;/g, '\\<');     // 修复 \&lt; 转义
    text = text.replace(/\\&amp;gt;/g, '\\>');     // 修复 \&gt; 转义
    text = text.replace(/\\&amp;quad/g, '\\quad'); // 修复 \&quad 转义
    
    return text;
}

// 自定义渲染函数
function renderMathWithPreprocessing(element) {
    // 先预处理所有数学公式内容
    const mathElements = element.querySelectorAll('p, div, span');
    mathElements.forEach(el => {
        if (el.textContent.includes('$$') || el.textContent.includes('$')) {
            el.innerHTML = preprocessMath(el.innerHTML);
        }
    });
    
    // 然后渲染数学公式
    renderMathInElement(element, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false,
        strict: false,
        preProcess: preprocessMath
    });
}

// 等待 KaTeX 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathWithPreprocessing(document.body);
    } else {
        // 如果 KaTeX 还没加载，等待一下
        setTimeout(function() {
            if (typeof renderMathInElement !== 'undefined') {
                renderMathWithPreprocessing(document.body);
            }
        }, 100);
    }
});
