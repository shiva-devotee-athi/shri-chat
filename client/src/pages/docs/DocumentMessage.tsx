import React from "react";

const DocumentMessage:React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-6">💬 Chat Application</h1>

      <p className="mb-6 text-lg">
        A real-time chat application designed for seamless communication,
        featuring modern frontend and backend technologies.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">✨ Features</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          🗨️ <strong>Real-time messaging</strong> powered by Socket.io
        </li>
        <li>
          🏗️ <strong>Modular and scalable UI</strong> with React + TypeScript
        </li>
        <li>
          🎨 <strong>Responsive design</strong> using Tailwind CSS
        </li>
        <li>
          🔒 <strong>Secure authentication</strong> with JWT and OAuth
        </li>
        <li>
          ⚡ <strong>Optimized backend</strong> using Express, Redis, and
          Sequelize
        </li>
        <li>
          📂 <strong>File upload handling</strong> with Multer
        </li>
        <li>
          🛢️ <strong>PostgreSQL database</strong> for structured data storage
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">🛠️ Tech Stack</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">🔷 Frontend</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>React TSX</li>
            <li>Tailwind CSS</li>
            <li>Socket.io Client</li>
            <li>React Redux</li>
            <li>React Router</li>
            <li>Axios</li>
            <li>React Hook Form & Zod</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🧩 Backend</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Express TypeScript</li>
            <li>Redis</li>
            <li>Sequelize ORM</li>
            <li>JWT Auth</li>
            <li>Socket.io</li>
            <li>Multer</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">📊 Database</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>PostgreSQL</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">🚀 Installation</h2>

      <h3 className="text-lg font-bold mb-1">📥 Clone the repository</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded">
        <code>
          {`git clone https://github.com/your-repo/chat-app.git
cd chat-app`}
        </code>
      </pre>

      <h3 className="text-lg font-bold mt-4 mb-1">💻 Frontend Setup</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded">
        <code>
          {`cd frontend
npm install
npm start`}
        </code>
      </pre>

      <h3 className="text-lg font-bold mt-4 mb-1">🖥️ Backend Setup</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded">
        <code>
          {`cd backend
npm install
npm run dev`}
        </code>
      </pre>

      <h3 className="text-lg font-bold mt-4 mb-1">🔐 Environment Variables</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded">
        <code>
          {`# .env
DATABASE_URL=your_postgres_connection
REDIS_URL=your_redis_connection
JWT_SECRET=your_jwt_secret`}
        </code>
      </pre>

      <h2 className="text-2xl font-semibold mt-8 mb-4">🧪 Usage</h2>
      <p className="mb-4">
        Run both frontend and backend services, then open the chat interface to
        start messaging in real-time.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">🤝 Contributing</h2>
      <p className="mb-4">
        Feel free to raise issues and submit pull requests! 🚀
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">📜 License</h2>
      <p className="mb-4">This project is licensed under MIT.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">📞 Contact</h2>
      <ul className="list-none space-y-1">
        <li>
          👤 <strong>shiva-devotee-athi</strong>
        </li>
        <li>📧 vijayathiraj99@gmail.com</li>
        <li>
          🌐{" "}
          <a
            className="text-blue-600 underline"
            href="https://shiva-devotee-athi.github.io/vijayathiraj/"
            target="_blank"
            rel="noreferrer"
          >
            Portfolio
          </a>
        </li>
      </ul>
    </div>
  );
};

export default DocumentMessage;
