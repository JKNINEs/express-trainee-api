const express = require('express');
const { PrismaClient } = require('@prisma/client'); // 1. เรียกใช้งาน Prisma

const app = express();
const prisma = new PrismaClient(); // 2. สร้างตัวเชื่อมต่อ Database
const port = 3000;

app.use(express.json());

// --- สร้าง Route ดึงข้อมูล (GET) ---
app.get('/trainees', async (req, res) => {
    // ท่าไม้ตายของเรา: สั่ง await ให้รอ Prisma ไปดึงข้อมูลทั้งหมดจากตาราง Trainee
    const allTrainees = await prisma.trainee.findMany(); 
    
    res.json({ 
        success: true, 
        message: "ดึงข้อมูลจาก Database สำเร็จ!", 
        data: allTrainees 
    });
});

app.get('/trainees/:id', async (req, res) => {
    const targetId = parseInt(req.params.id);
    // ท่าไม้ตายของเรา: สั่ง await ให้รอ Prisma ไปดึงข้อมูลทั้งหมดจากตาราง Trainee
    const oneTrainees = await prisma.trainee.findUnique({
        where: {
            id: targetId
        }
    });
    
    if (!oneTrainees) {
        return res.status(404).json({
            success: false,
            message: "ไม่พบผู้สมัครเข้าอบรมนี้"
        })
    }
    
    res.json({ 
        success: true, 
        message: "ดึงข้อมูลจาก Database สำเร็จ!", 
        data: oneTrainees 
    });
});


// --- สร้าง Route เพิ่มข้อมูล (POST) ---
app.post('/trainees', async (req, res) => {
    // แกะข้อมูลที่หน้าบ้าน (Postman) ส่งมา
    const { name, attendance, status } = req.body; 

    // สั่ง Prisma ให้เอาข้อมูลไปบันทึกลง Database
    const newTrainee = await prisma.trainee.create({
        data: {
            name: name,
            attendance: attendance,
            status: status || "Normal" // ถ้าไม่ได้ส่งสถานะมา ให้ใช้คำว่า Normal
        }
    });

    res.json({ 
        success: true, 
        message: "บันทึกผู้เข้าอบรมลง Database เรียบร้อย!", 
        data: newTrainee 
    });
});

// --- สร้าง Route อัปเดตข้อมูล (PUT) ---
app.put('/trainees/:id', async (req, res) => {
    // 1. ดึงรหัสเป้าหมายจาก URL (เหมือนตอนทำ DELETE)
    const targetId = parseInt(req.params.id);
    
    // 2. รับข้อมูล "สถานะใหม่" จากหน้าบ้าน (Postman)
    const { status } = req.body; 

    try {
        // 3. ท่าไม้ตาย Prisma: สั่ง update โดยระบุ where (ค้นหาใคร) และ data (แก้เป็นอะไร)
        const updatedTrainee = await prisma.trainee.update({
            where: { 
                id: targetId 
            },
            data: { 
                status: status // เอาสถานะที่ส่งมาไปอัปเดตทับของเดิม
            }
        });

        res.json({
            success: true,
            message: `อัปเดตสถานะของรหัส ${targetId} เป็น ${status} เรียบร้อย!`,
            data: updatedTrainee
        });

    } catch (error) {
        // 4. กันเหนียว! ถ้าหน้าบ้านส่ง ID มั่วๆ มา จะเด้งเข้าบล็อกนี้แทนการทำให้เว็บล่ม
        res.status(404).json({
            success: false,
            message: "ไม่พบผู้เข้าอบรมรหัสนี้ในระบบ หรืออัปเดตไม่สำเร็จ"
        });
    }
});


// --- สร้าง Route อัปเดตข้อมูล (PUT) ---
app.delete('/trainees/:id', async (req, res) => {
    // 1. ดึงรหัสเป้าหมายจาก URL (เหมือนตอนทำ DELETE)
    const targetId = parseInt(req.params.id);
    
    // 2. รับข้อมูล "สถานะใหม่" จากหน้าบ้าน (Postman)
   

    try {
        // 3. ท่าไม้ตาย Prisma: สั่ง update โดยระบุ where (ค้นหาใคร) และ data (แก้เป็นอะไร)
        const deleteTrainee = await prisma.trainee.delete({
            where: { 
                id: targetId 
            },
        });

        res.json({
            success: true,
            message: `ลบข้อมูล ${targetId} เรียบร้อย!`,
            data: deleteTrainee
        });

    } catch (error) {
        // 4. กันเหนียว! ถ้าหน้าบ้านส่ง ID มั่วๆ มา จะเด้งเข้าบล็อกนี้แทนการทำให้เว็บล่ม
        res.status(404).json({
            success: false,
            message: "ไม่พบผู้เข้าอบรมรหัสนี้ในระบบ "
        });
    }
});
app.listen(port, () => {
    console.log(`🚀 Server กำลังรันอยู่ที่ http://localhost:${port}`);
});