class Physics {
    // 碰撞检测算法: 矩形 vs 矩形
    static rectRect(rect1, rect2,rate1 = 1,rate2=1) {
        // log("rect1:"+JSON.stringify(rect1)+"; rect2:"+JSON.stringify(rect2));
        if(rate1!==1){
            rect1.x += (rate1-1)*rect1.width;
            rect1.y += (rate1-1)*rect1.height;
            rect1.width *= rate1;
            rect1.height *= rate1;
        }
        if(rate2!==1){
            rect2.x += (rate2-1)*rect2.width;
            rect2.y += (rate2-1)*rect2.height;
            rect2.width *= rate2;
            rect2.height *= rate2;
        }

        return rect1.x < rect2.x + rect2.width
            && rect1.x + rect1.width > rect2.x
            && rect1.y < rect2.y + rect2.height
            && rect1.y + rect1.height > rect2.y;
    }

    // 碰撞检测算法: 圆形 vs 圆形
    static circleCircle(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }

    // 碰撞检测算法: 矩形 vs 圆形
    static rectCircle(rect, circle) {
        let testX = circle.x;
        let testY = circle.y;
        if (circle.x < rect.x) testX = rect.x; else if (circle.x > rect.x + rect.width) testX = rect.x + rect.width;
        if (circle.y < rect.y) testY = rect.y; else if (circle.y > rect.y + rect.height) testY = rect.y + rect.height;
        const distX = circle.x - testX;
        const distY = circle.y - testY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance <= circle.radius;
    }


}
