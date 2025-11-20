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
  },
  {
    id: '2',
    type: 'place',
    author: 'Carlos Ruiz',
    authorId: 'user2',
    authorCity: 'Madrid',
    avatar: '👴',
    title: 'Café La Tertulia',
    description: 'Café tranquilo con tertulias literarias los miércoles. Ambiente acogedor y café excelente.',
    location: 'Calle Mayor 45, Madrid',
    category: 'Social',
    rating: 4.5,
    likes: 34,
    likedBy: [],
    comments: [],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'companion',
    author: 'Ana Martín',
    authorId: 'user3',
    authorCity: 'Barcelona',
    avatar: '👵',
    title: 'Busco compañía para ir al teatro',
    description: 'El sábado hay una obra muy buena en el Teatro Español. ¿Alguien se anima?',
    date: '2025-11-23',
    time: '19:00',
    category: 'Cultural',
    likes: 15,
    likedBy: [],
    comments: [],
    createdAt: new Date().toISOString()
  }
];

const categories = ['Todos', 'Cultural', 'Deportivo', 'Social', 'Educativo', 'Ocio'];

const badges = [
  { name: 'Explorador', icon: '🗺️', points: 100, desc: 'Publica 10 lugares' },
  { name: 'Social', icon: '🤝', points: 50, desc: 'Haz 5 amigos' },
  { name: 'Activo', icon: '⚡', points: 200, desc: 'Asiste a 20 eventos' },
  { name: 'Maestro', icon: '📚', points: 150, desc: 'Comparte 10 tutoriales' }
];

function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [posts, setPosts] = useState(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userCity, setUserCity] = useState('Madrid');
  const [userStats, setUserStats] = useState({
    posts: 0,
    eventsAttended: 0,
    friends: 0
  });

  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    city: 'Madrid',
    age: ''
  });

  const [newPost, setNewPost] = useState({
    type: 'event',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Cultural'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('vivo_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserCity(userData.city);
      setUserPoints(userData.points || 0);
      setUserStats(userData.stats || { posts: 0, eventsAttended: 0, friends: 0 });
    }
  }, []);

  useEffect(() => {
    if (user) {
      const userData = {
        ...user,
        points: userPoints,
        stats: userStats,
        city: userCity
      };
      localStorage.setItem('vivo_user', JSON.stringify(userData));
    }
  }, [user, userPoints, userStats, userCity]);

  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAuth = () => {
    if (isLogin) {
      if (!authForm.email || !authForm.password) {
        alert('Por favor completa todos los campos');
        return;
      }
      
      const userData = {
        id: 'user_' + Date.now(),
        email: authForm.email,
        name: authForm.email.split('@')[0],
        city: userCity,
        avatar: '😊',
        points: 0,
        stats: { posts: 0, eventsAttended: 0, friends: 0 }
      };
      
      setUser(userData);
      setShowAuth(false);
      alert('¡Bienvenido/a a VIVO! 🎉');
    } else {
      if (!authForm.email || !authForm.password || !authForm.name || !authForm.age) {
        alert('Por favor completa todos los campos');
        return;
      }

      if (parseInt(authForm.age) < 60) {
        alert('VIVO es exclusivo para mayores de 60 años 😊');
        return;
      }

      const userData = {
        id: 'user_' + Date.now(),
        email: authForm.email,
        name: authForm.name,
        city: authForm.city,
        age: authForm.age,
        avatar: '😊',
        points: 100,
        stats: { posts: 0, eventsAttended: 0, friends: 0 }
      };

      setUser(userData);
      setUserCity(userData.city);
      setUserPoints(100);
      setShowAuth(false);
      alert('¡Bienvenido/a a VIVO! Has ganado 100 puntos de bienvenida 🎉');
    }

    setAuthForm({
      email: '',
      password: '',
      name: '',
      city: 'Madrid',
      age: ''
    });
  };

  const handleLogout = () => {
    setUser(null);
    setUserPoints(0);
    setUserStats({ posts: 0, eventsAttended: 0, friends: 0 });
    localStorage.removeItem('vivo_user');
    setCurrentView('feed');
    alert('Has cerrado sesión. ¡Hasta pronto! 👋');
  };

  const handleLike = (postId) => {
    if (!user) {
      alert('Inicia sesión para dar "me gusta" 😊');
      return;
    }

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const liked = post.likedBy?.includes(user.id);
        return {
          ...post,
          likes: liked ? post.likes - 1 : post.likes + 1,
          likedBy: liked 
            ? post.likedBy.filter(id => id !== user.id)
            : [...(post.likedBy || []), user.id]
        };
      }
      return post;
    }));
  };

  const handleNewPost = () => {
    if (!user) {
      alert('Inicia sesión para publicar 😊');
      return;
    }

    if (!newPost.title || !newPost.description) {
      alert('Por favor completa título y descripción');
      return;
    }

    const pointsEarned = newPost.type === 'event' ? 50 : 30;
    
    const post = {
      id: 'post_' + Date.now(),
      ...newPost,
      author: user.name,
      authorId: user.id,
      authorCity: userCity,
      avatar: user.avatar,
      likes: 0,
      likedBy: [],
      comments: [],
      verified: 0,
      createdAt: new Date().toISOString()
    };

    setPosts([post, ...posts]);
    setUserPoints(userPoints + pointsEarned);
    setUserStats({
      ...userStats,
      posts: userStats.posts + 1
    });
    
    setNewPost({
      type: 'event',
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Cultural'
    });
    
    setShowNewPost(false);
    alert(`¡Publicación creada! Has ganado ${pointsEarned} puntos 🎉`);
  };

  const handleVerify = (postId) => {
    if (!user) {
      alert('Inicia sesión para verificar eventos 😊');
      return;
    }

    setPosts(posts.map(post => 
      post.id === postId ? { ...post, verified: post.verified + 1 } : post
    ));

    setUserPoints(userPoints + 10);
    setUserStats({
      ...userStats,
      eventsAttended: userStats.eventsAttended + 1
    });
  };

  const PostCard = ({ post }) => {
    const getTypeIcon = () => {
      switch(post.type) {
        case 'event': return <Calendar className="w-6 h-6" />;
        case 'place': return <MapPin className="w-6 h-6" />;
        case 'companion': return <Users className="w-6 h-6" />;
        case 'tutorial': return <BookOpen className="w-6 h-6" />;
        default: return <Heart className="w-6 h-6" />;
      }
    };

    const getTypeLabel = () => {
      switch(post.type) {
        case 'event': return '🎉 Evento';
        case 'place': return '📍 Lugar';
        case 'companion': return '👥 Busco Compañía';
        case 'tutorial': return '📚 Tutorial';
        default: return '✨ Experiencia';
      }
    };

    const isLiked = user && post.likedBy?.includes(user.id);

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{post.avatar}</div>
            <div>
              <p className="text-xl font-bold text-gray-800">{post.author}</p>
              <p className="text-lg text-gray-500">{post.authorCity}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
            {getTypeIcon()}
            <span className="text-lg font-semibold text-blue-700">{getTypeLabel()}</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h3>
        <p className="text-xl text-gray-700 mb-4 leading-relaxed">{post.description}</p>

        <div className="space-y-2 mb-4">
          {post.date && (
            <div className="flex items-center gap-2 text-lg text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">{post.date} {post.time && `a las ${post.time}`}</span>
            </div>
          )}
          {post.location && (
            <div className="flex items-center gap-2 text-lg text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{post.location}</span>
            </div>
          )}
          {post.rating && (
            <div className="flex items-center gap-2 text-lg text-yellow-600">
              <Star className="w-5 h-5 fill-yellow-400" />
              <span className="font-bold">{post.rating} / 5</span>
            </div>
          )}
        </div>

        <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-lg font-semibold mb-4">
          {post.category}
        </span>

        {post.verified > 0 && (
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4 inline-flex">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-lg text-green-700 font-semibold">
              {post.verified} personas confirmaron esto
            </span>
          </div>
        )}

        <div className="flex gap-6 pt-4 border-t-2 border-gray-100">
          <button 
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-2 text-xl transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-7 h-7 ${isLiked ? 'fill-red-500' : ''}`} />
            <span className="font-bold">{post.likes}</span>
          </button>
          <button className="flex items-center gap-2 text-xl text-gray-600 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-7 h-7" />
            <span className="font-bold">{post.comments?.length || 0}</span>
          </button>
          <button 
            onClick={() => handleVerify(post.id)}
            className="flex items-center gap-2 text-xl text-green-600 hover:text-green-700 transition-colors ml-auto font-bold"
          >
            <CheckCircle className="w-7 h-7" />
            <span>¡Yo fui!</span>
          </button>
        </div>
      </div>
    );
  };

  const FeedView = () => (
    <div>
      {!user && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-6 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">¡Bienvenido/a a VIVO!</h2>
          <p className="text-xl mb-6">La red social donde los jubilados nunca se aburren</p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Unirse Gratis
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Buscar eventos, lugares..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl text-lg font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-2xl text-gray-500 mb-4">No hay publicaciones en esta categoría</p>
          <p className="text-xl text-gray-400">¡Sé el primero en publicar algo!</p>
        </div>
      ) : (
        filteredPosts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );

  const ProfileView = () => {
    if (!user) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <User className="w-24 h-24 mx-auto mb-4 text-gray-300" />
          <h2 className="text-3xl font-bold mb-4">Inicia sesión para ver tu perfil</h2>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-600 transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <div className="text-6xl mb-4 text-center">{user.avatar}</div>
          <h2 className="text-3xl font-bold text-center mb-2">{user.name}</h2>
          <p className="text-xl text-center opacity-90">{userCity}</p>
          {user.age && (
            <p className="text-lg text-center opacity-80 mt-1">{user.age} años</p>
          )}
          
          <div className="mt-6 bg-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-semibold">Mis Puntos</span>
              <span className="text-4xl font-bold">{userPoints}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-4">
              <div 
                className="bg-white h-4 rounded-full transition-all"
                style={{ width: `${(userPoints % 100)}%` }}
              ></div>
            </div>
            <p className="text-lg mt-2 opacity-90">
              {100 - (userPoints % 100)} puntos para la siguiente insignia
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-7 h-7 text-yellow-500" />
            Mis Insignias
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl text-center transition-all ${
                  userPoints >= badge.points
                    ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-5xl mb-2">{badge.icon}</div>
                <p className="text-xl font-bold text-gray-800">{badge.name}</p>
                <p className="text-sm text-gray-600 mb-1">{badge.desc}</p>
                <p className="text-lg text-gray-600">{badge.points} pts</p>
                {userPoints >= badge.points && (
                  <p className="text-sm text-green-600 font-bold mt-2">¡Conseguida!</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold mb-4">Mis Estadísticas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xl">
              <span className="text-gray-600">Publicaciones:</span>
              <span className="font-bold text-2xl">{userStats.posts}</span>
            </div>
            <div className="flex justify-between items-center text-xl">
              <span className="text-gray-600">Eventos asistidos:</span>
              <span className="font-bold text-2xl">{userStats.eventsAttended}</span>
            </div>
            <div className="flex justify-between items-center text-xl">
              <span className="text-gray-600">Amigos:</span>
              <span className="font-bold text-2xl">{userStats.friends}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-6 py-4 rounded-xl text-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-6 h-6" />
          Cerrar Sesión
        </button>
      </div>
    );
  };

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Iniciar Sesión' : 'Registro'}
          </h2>
          <button onClick={() => setShowAuth(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-700">Nombre completo</label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  placeholder="Tu nombre"
                  className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-700">Edad</label>
                <input
                  type="number"
                  value={authForm.age}
                  onChange={(e) => setAuthForm({...authForm, age: e.target.value})}
                  placeholder="Debe ser mayor de 60"
                  className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-700">Ciudad</label>
                <select
                  value={authForm.city}
                  onChange={(e) => setAuthForm({...authForm, city: e.target.value})}
                  className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option>Madrid</option>
                  <option>Barcelona</option>
                  <option>Valencia</option>
                  <option>Sevilla</option>
                  <option>Zaragoza</option>
                  <option>Málaga</option>
                  <option>Bilbao</option>
                  <option>Zamora</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              placeholder="tu@email.com"
              className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Contraseña</label>
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              placeholder="••••••••"
              className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleAuth}
            className="w-full bg-blue-500 text-white px-6 py-4 rounded-xl text-xl font-bold hover:bg-blue-600 transition-colors"
          >
            {isLogin ? 'Entrar' : 'Registrarse'}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-blue-500 text-lg hover:underline"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );

  const NewPostModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Nueva Publicación</h2>
          <button onClick={() => setShowNewPost(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xl font-semibold mb-3 text-gray-700">Tipo de publicación</label>
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({...newPost, type: e.target.value})}
              className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="event">🎉 Evento</option>
              <option value="place">📍 Lugar Recomendado</option>
              <option value="companion">👥 Busco Compañía</option>
              <option value="tutorial">📚 Tutorial</option>
            </select>
          </div>

          <div>
            <label className="block text-xl font-semibold mb-3 text-gray-700">Título</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              placeholder="Ej: Clase de Yoga en el Parque"
              className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold mb-3 text-gray-700">Descripción</label>
            <textarea
              value={newPost.description}
              onChange={(e) => setNewPost({...newPost, description: e.target.value})}
              placeholder="Cuenta los detalles..."
              rows="4"
              className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          {(newPost.type === 'event' || newPost.type === 'companion') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-semibold mb-3 text-gray-700">Fecha</label>
                <input
                  type="date"
                  value={newPost.date}
                  onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                  className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xl font-semibold mb-3 text-gray-700">Hora</label>
                <input
                  type="time"
                  value={newPost.time}
                  onChange={(e) => setNewPost({...newPost, time: e.target.value})}
                  className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xl font-semibold mb-3 text-gray-700">Ubicación</label>
            <input
              type="text"
              value={newPost.location}
              onChange={(e) => setNewPost({...newPost, location: e.target.value})}
              placeholder="Ej: Parque del Retiro"
              className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold mb-3 text-gray-700">Categoría</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="Cultural">Cultural</option>
              <option value="Deportivo">Deportivo</option>
              <option value="Social">Social</option>
              <option value="Educativo">Educativo</option>
              <option value="Ocio">Ocio</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowNewPost(false)}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl text-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleNewPost}
              className="flex-1 px-6 py-4 bg-blue-500 text-white rounded-xl text-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Publicar (+{newPost.type === 'event' ? '50' : '30'} pts)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">✨</div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  VIVO
                </h1>
                <p className="text-lg text-gray-600">Nunca dejes de vivir</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden md:flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                  <Star className="w-6 h-6 text-yellow-600 fill-yellow-400" />
                  <span className="text-xl font-bold text-yellow-700">{userPoints} pts</span>
                </div>
              )}
              {user ? (
                <button className="p-3 hover:bg-gray-100 rounded-full relative">
                  <Bell className="w-7 h-7 text-gray-600" />
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <LogIn className="w-6 h-6" />
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <nav className="space-y-3">
                <button
                  onClick={() => setCurrentView('feed')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xl font-semibold transition-colors ${
                    currentView === 'feed'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-6 h-6" />
                  Inicio
                </button>
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xl font-semibold transition-colors ${
                    currentView === 'profile'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-6 h-6" />
                  Mi Perfil
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xl font-semibold transition-colors ${
                    currentView === 'calendar'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-6 h-6" />
                  Mi Agenda
                </button>
              </nav>

              {user && (
                <div className="mt-6 pt-6 border-t-2 border-gray-100">
                  <p className="text-lg text-gray-600 mb-3">Tu ciudad:</p>
                  <select
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    className="w-full p-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option>Madrid</option>
                    <option>Barcelona</option>
                    <option>Valencia</option>
                    <option>Sevilla</option>
                    <option>Zaragoza</option>
                    <option>Málaga</option>
                    <option>Bilbao</option>
                    <option>Zamora</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {currentView === 'feed' && <FeedView />}
            {currentView === 'profile' && <ProfileView />}
            {currentView === 'calendar' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Calendar className="w-24 h-24 mx-auto mb-4 text-blue-500" />
                <h2 className="text-3xl font-bold mb-2">Mi Agenda</h2>
                <p className="text-xl text-gray-600">Próximamente: Calendario personalizado con todos tus eventos guardados</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {user && (
        <button
          onClick={() => setShowNewPost(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-3">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setCurrentView('feed')}
            className={`flex flex-col items-center gap-1 ${
              currentView === 'feed' ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <Home className="w-7 h-7" />
            <span className="text-sm font-semibold">Inicio</span>
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex flex-col items-center gap-1 ${
              currentView === 'calendar' ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <Calendar className="w-7 h-7" />
            <span className="text-sm font-semibold">Agenda</span>
          </button>
          {user && (
            <button
              onClick={() => setShowNewPost(true)}
              className="flex flex-col items-center gap-1 text-purple-600"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full -mt-8">
                <Plus className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold">Publicar</span>
            </button>
          )}
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center gap-1 ${
              currentView === 'profile' ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <User className="w-7 h-7" />
            <span className="text-sm font-semibold">Perfil</span>
          </button>
        </div>
      </nav>

      {showNewPost && <NewPostModal />}
      {showAuth && <AuthModal />}
    </div>
  );
}

export default App;
