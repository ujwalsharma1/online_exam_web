import React from "react";
import { Layout, Typography, Button, Row, Col, Divider, Tag } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
  CodeOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Paragraph, Link, Text } = Typography;
const { Header, Content, Footer } = Layout;

const Landing = () => {
  return (
    <Layout>
      <Header
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1606326608690-4e0281b1e588?w=1200&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    textAlign: "center",
    padding: "180px 20px",
    height: "100%", 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}
>
 
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
    }}
  />

  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7 }}
    style={{ zIndex: 2 }}
  >
    <Title style={{ color: "#fff", fontSize: "48px" }}>Exam Master</Title>
  </motion.div>

  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    style={{ zIndex: 2 }}
  >
    <Paragraph style={{ color: "#fff", fontSize: "18px" }}>
      Your hub for online examination and evaluation
    </Paragraph>
  </motion.div>

  <motion.div
    style={{ marginTop: "20px", zIndex: 2 }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.6 }}
  >
    <Button type="primary" size="large" href="/signup" style={{ marginRight: "10px" }}>
      Get Started
    </Button>
    <Button type="default" size="large" href="/login">
      Login
    </Button>
  </motion.div>
        </Header>


      
      <Content style={{ padding: "50px 20px" }}>
    
        <Section title="About Exam Master">
          <Paragraph>
            Exam Master is a comprehensive, secure, and user-friendly online platform for conducting exams. Built for educators and institutions to simplify assessment workflows.
          </Paragraph>
        </Section>

        <Section title="How It Works">
          <Row gutter={32}>
            <Col md={8}>
              <Step icon={<FileTextOutlined />} title="1. Create Test" desc="Teachers create MCQ/descriptive exams with timers and access controls." />
            </Col>
            <Col md={8}>
              <Step icon={<UserOutlined />} title="2. Assign to Students" desc="Assign tests to specific students or open to all. Notifications sent instantly." />
            </Col>
            <Col md={8}>
              <Step icon={<CheckCircleOutlined />} title="3. Attempt & Evaluate" desc="Students attempt tests, and results are auto-evaluated in real-time." />
            </Col>
          </Row>
        </Section>

        
        <Section title="Platform Features">
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={6}><Feature icon={<SafetyCertificateOutlined />} text="Secure Login System" /></Col>
            <Col xs={24} md={6}><Feature icon={<BarChartOutlined />} text="Performance Analytics" /></Col>
            <Col xs={24} md={6}><Feature icon={<ScheduleOutlined />} text="Timed Tests with Auto-Submit" /></Col>
            <Col xs={24} md={6}><Feature icon={<ThunderboltOutlined />} text="Instant Result Generation" /></Col>
          </Row>
        </Section>


        <Section title="Why Choose Exam Master?">
          <Row gutter={32}>
            <Col md={12}>
              <ul style={{ fontSize: "16px", lineHeight: 2 }}>
                <li>✅ No paper printing or manual checking</li>
                <li>✅ Save time with auto grading</li>
                <li>✅ Access student data anytime</li>
                <li>✅ Highly customizable for institutions</li>
              </ul>
            </Col>
            <Col md={12}>
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/online-exam-5699983-4752093.png" alt="benefits" width="100%" />
            </Col>
          </Row>
        </Section>


        <Section title="Powered By">
          <Row gutter={[24, 24]} justify="center">
            <TechTag icon={<CodeOutlined />} name="React + Ant Design" />
            <TechTag icon={<CodeOutlined />} name="Node.js + Express" />
            <TechTag icon={<CodeOutlined />} name="MongoDB (Mongoose)" />
            <TechTag icon={<CodeOutlined />} name="JWT Auth + Role Access" />
            <TechTag icon={<CodeOutlined />} name="Multer for File Uploads" />
            <TechTag icon={<MobileOutlined />} name="Fully Responsive" />
          </Row>
        </Section>

        <Section title="Use Cases">
          <Row gutter={24}>
            <Col md={8}>
              <Title level={4}>🏫 Schools & Colleges</Title>
              <Paragraph>Conduct semester exams or weekly quizzes online with complete control.</Paragraph>
            </Col>
            <Col md={8}>
              <Title level={4}>📚 Coaching Institutes</Title>
              <Paragraph>Create regular mock tests and track student performance effectively.</Paragraph>
            </Col>
            <Col md={8}>
              <Title level={4}>🏢 Corporate Training</Title>
              <Paragraph>Evaluate training sessions with skill tests and certifications.</Paragraph>
            </Col>
          </Row>
        </Section>

 
        <Section title="Ready to Get Started?">
          <Paragraph>Sign up today and make your exam process 10x faster and smarter.</Paragraph>
          <Button type="primary" size="large" href="/signup">Start Now</Button>
        </Section>

 
        <Section title="Contact Us">
          <Paragraph>
            Email: <Link href="mailto:udhavvinaik@gmail.com">udhavvinaik@gmail.com</Link><br />
            Phone: <Link href="tel:+912210992476">+91 2210992476</Link>
          </Paragraph>
        </Section>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        &copy; {new Date().getFullYear()} Exam Master. All rights reserved.
      </Footer>
    </Layout>
  );
};

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    style={{ marginBottom: "60px" }}
  >
    <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>{title}</Title>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>{children}</div>
  </motion.div>
);

const Feature = ({ icon, text }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    style={{
      textAlign: "center",
      padding: "20px",
      border: "1px solid #f0f0f0",
      borderRadius: "8px",
      height: "100%",
    }}
  >
    <div style={{ fontSize: "32px", marginBottom: "10px", color: "#1890ff" }}>
      {icon}
    </div>
    <Text strong>{text}</Text>
  </motion.div>
);

const Step = ({ icon, title, desc }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: "36px", marginBottom: "10px", color: "#722ed1" }}>{icon}</div>
    <Title level={4}>{title}</Title>
    <Paragraph>{desc}</Paragraph>
  </div>
);

const TechTag = ({ icon, name }) => (
  <Col xs={12} md={6}>
    <Tag icon={icon} color="blue" style={{ fontSize: "16px", padding: "5px 12px" }}>
      {name}
    </Tag>
  </Col>
);

export default Landing;
