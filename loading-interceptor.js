// 拦截所有链接点击
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetUrl = this.href;
            
            // 在当前窗口创建loading遮罩层
            const loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.style.position = 'fixed';
            loader.style.top = '0';
            loader.style.left = '0';
            loader.style.width = '100%';
            loader.style.height = '100%';
            loader.style.backgroundColor = '#000';
            loader.style.zIndex = '9999';
            loader.style.display = 'flex';
            loader.style.justifyContent = 'center';
            loader.style.alignItems = 'center';
            document.body.appendChild(loader);
            
            // 延迟跳转确保loading显示
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 300);
        });
    });
});