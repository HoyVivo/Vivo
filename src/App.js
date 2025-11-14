import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, BookOpen, Heart, MessageCircle, Plus, Search, Award, Home, User, Bell, Star, CheckCircle, LogOut, LogIn, X } from 'lucide-react';

const mockPosts = [
  {
    id: '1',
    type: 'event',
    author: 'María González',
    authorId: 'user1',
    authorCity: 'Madrid',
    avatar: '👵',
    title: 'Clase de Yoga en el Parque',
    description: 'Todos los martes y jueves a las 10:00. ¡Gratis! Traed vuestra esterilla.',
    date: '2025-11-20',
    time: '10:00',
    location: 'Parque del Retiro',
    category: 'Deportivo',
    likes: 23,
    likedBy: [],
    comments: [],
    verified: 3,
    createdAt: new Date().toISOString()
  }
];

const categories = ['Todos', 'Cultural', 'Deportivo', 'Social', 'Educativo', 'Ocio'];

function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [posts, setPosts] = useState(mockPosts);
  const [user, setUser] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            VIVO
          </h1>
          <p className="text-2xl text-gray-600 mb-8">Nunca dejes de vivir</p>
          <p className="text-xl text-gray-500">¡La red social para jubilados está funcionando!</p>
        </div>
      </div>
    </div>
  );
}

export default App;