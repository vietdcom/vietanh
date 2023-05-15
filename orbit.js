CelestialBody.prototype.updateOrbitAndRotation = function (time) {
    // Khởi tạo các biến referenceFrameX, referenceFrameY, 
    // referenceFrameZ với giá trị ban đầu là 0. Đây là tọa độ trung tâm 
    // của cơ thể cha của đối tượng hiện tại trong không gian.
    var referenceFrameX = 0;
    var referenceFrameY = 0;
    var referenceFrameZ = 0;
    // Kiểm tra nếu this.parent (cơ thể cha) không phải là null, tức là đối tượng hiện tại có cơ thể cha
    if (this.parent != null) {
        // Trong trường hợp này, ta cập nhật các tọa độ referenceFrameX, referenceFrameY, 
        // referenceFrameZ thành tọa độ của cơ thể cha bằng cách gọi các phương thức getX(), getY(), getZ() của cơ thể cha.
        referenceFrameX = this.parent.getX();
        referenceFrameY = this.parent.getY();
        referenceFrameZ = this.parent.getZ();
        // x -> z   y -> z  z -> x
        //1.11version
        //r=a*(1-e^2)/(1+ecoswt)
        //x=rcoswt+c
        //y=rsinwt
        // Sử dụng các công thức tính toán, ta tính toán ra giá trị r (bán kính) và các giá trị x, y, z (tọa độ) 
        // của hành tinh dựa trên thời gian cho trước.
        var r = this.orbit.semiMajorAxis * (1 - this.orbit.eccentricity * this.orbit.eccentricity) / (1 + this.orbit.eccentricity * Math.cos(10.0 * -time / this.orbit.period));
        var x = referenceFrameX + (r * Math.cos(10.0 * -time / this.orbit.period)) * Math.cos(this.orbit.inclination / 180.0 * Math.PI);
        var y = referenceFrameY + (r * Math.cos(10.0 * -time / this.orbit.period)) * Math.sin(this.orbit.inclination / 180.0 * Math.PI);
        var z = referenceFrameZ + r * Math.sin(10.0 * -time / this.orbit.period);
        // Kiểm tra nếu this.isComet (đối tượng hiện tại có phải là thiên thạch không?) là true. 
        if (this.isComet) {
            // Trong trường hợp này, ta cập nhật vị trí của điểm gắn pivot của thiên thạch (cometPivot.position.set(x, y, z)) 
            // và vị trí của nhóm đối tượng (objectGroup.position.set(x, y, z)).
            this.cometPivot.position.set(x, y, z);
            if (cometSet) {
                this.objectGroup.position.set(x, y, z);
                lastCometX = x;
                lastCometY = y;
                lastCometZ = z;
                cometSet = false;
            }
            // Cập nhật các biến và tính toán liên quan đến thiên thạch. Đoạn mã này sử dụng một số biến và thuộc tính 
            // chưa được định nghĩa trong đoạn mã đã cung cấp, như cometSet, clock, delta, spawnerOptions, tick, 
            // cometParams, options, particleSystem, lastCometX, lastCometY, lastCometZ, size, và spawnRate. 
            // Đoạn mã này thực hiện việc cập nhật vị trí và tính toán các thông số liên quan đến đuôi của thiên thạch.
            var delta = clock.getDelta() * spawnerOptions.timeScale;
            tick += delta;
            if (tick < 0) tick = 0;
            if (delta > 0) {
                var distance = Math.sqrt(this.getX() * this.getX() + this.getY() * this.getY() + this.getZ() * this.getZ());
                var tailLength = cometParams["Length"] / distance;
                options.size = cometParams["Size"] / distance;
                this.particleSystem.color = new THREE.Color();
                options.position.x -= tailLength * x / Math.sqrt(x * x + y * y + z * z);
                options.position.y -= tailLength * y / Math.sqrt(x * x + y * y + z * z);
                options.position.z -= tailLength * z / Math.sqrt(x * x + y * y + z * z);
                // options.sizeRandomness = 2;
                for (var i = 0; i < spawnerOptions.spawnRate * delta; i++) {
                    this.particleSystem.spawnParticle(options);
                }
                this.objectGroup.position.x += ( tailLength * x / Math.sqrt(x * x + y * y + z * z) );
                this.objectGroup.position.y += ( tailLength * y / Math.sqrt(x * x + y * y + z * z) );
                this.objectGroup.position.z += ( tailLength * z / Math.sqrt(x * x + y * y + z * z) );
                this.objectGroup.position.x += (x - lastCometX);
                this.objectGroup.position.y += (y - lastCometY);
                this.objectGroup.position.z += (z - lastCometZ);
            }
            this.particleSystem.update(tick);
            lastCometX = x;
            lastCometY = y;
            lastCometZ = z;
        // Nếu đối tượng hiện tại không phải là thiên thạch, ta cập nhật vị trí của nhóm đối tượng 
        // (objectGroup.position.set(x, y, z)) và thực hiện xoay tự thân của đối tượng xung quanh trục y 
        // (objectGroup.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.1 / this.rotation.period)).
        } else {
            this.objectGroup.position.set(x, y, z);
            // self-rotation
            this.objectGroup.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.1 / this.rotation.period);
        }

    }
};
