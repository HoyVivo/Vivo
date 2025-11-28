import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, BookOpen, Heart, MessageCircle, Plus, Search, Award, Home, User, Bell, Star, CheckCircle, LogOut, LogIn, X, TrendingUp, Sparkles } from 'lucide-react';

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
    image: '🧘‍♀️',
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
    image: '☕',
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
    image: '🎭',
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
      // CAMBIO: Sin restricción de edad
      if (!authForm.email || !authForm.password || !authForm.name) {
        alert('Por favor completa todos los campos');
        return;
      }

      const userData = {
        id: 'user_' + Date.now(),
        email: authForm.email,
        name: authForm.name,
        city: authForm.city,
        age: authForm.age || '',
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

  const handleComment = (postId, commentText) => {
    if (!user) {
      alert('Inicia sesión para comentar 😊');
      return;
    }

    if (!commentText.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...(post.comments || []),
            {
              id: Date.now().toString(),
              author: user.name,
              authorAvatar: user.avatar,
              text: commentText,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return post;
    }));
  };

  const handleNewPost = () => {
    if (!user) {
      alert('Inicia sesión para crear publicaciones 😊');
      return;
    }

    if (!newPost.title || !newPost.description) {
      alert('Por favor completa al menos el título y la descripción');
      return;
    }

    const post = {
      id: Date.now().toString(),
      ...newPost,
      author: user.name,
      authorId: user.id,
      authorCity: userCity,
      avatar: user.avatar,
      likes: 0,
      likedBy: [],
      comments: [],
      verified: 0,
      image: newPost.type === 'event' ? '📅' : newPost.type === 'place' ? '📍' : '🤝',
      createdAt: new Date().toISOString()
    };

    setPosts([post, ...posts]);
    setUserPoints(userPoints + 50);
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
    alert('¡Publicación creada! +50 puntos 🎉');
  };

  const PostCard = ({ post }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const isLiked = user && post.likedBy?.includes(user.id);

    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-4 border-orange-200 hover:border-orange-300 transition-all">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-5xl">{post.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-800">{post.author}</h3>
              {post.verified >= 3 && (
                <CheckCircle className="w-7 h-7 text-blue-500 fill-blue-500" />
              )}
            </div>
            <p className="text-xl text-gray-600">{post.authorCity}</p>
          </div>
          <span className="px-5 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full text-lg font-bold shadow-lg">
            {post.category}
          </span>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{post.image}</span>
            <h4 className="text-3xl font-bold text-gray-900">{post.title}</h4>
          </div>
          <p className="text-2xl text-gray-700 leading-relaxed mb-4">{post.description}</p>
          
          {post.type === 'event' && (
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 bg-blue-50 px-5 py-3 rounded-2xl border-2 border-blue-200">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-semibold text-blue-800">{post.date}</span>
              </div>
              {post.time && (
                <div className="flex items-center gap-2 bg-purple-50 px-5 py-3 rounded-2xl border-2 border-purple-200">
                  <span className="text-xl font-semibold text-purple-800">{post.time}</span>
                </div>
              )}
            </div>
          )}
          
          {post.location && (
            <div className="flex items-center gap-2 mt-4 bg-green-50 px-5 py-3 rounded-2xl border-2 border-green-200 w-fit">
              <MapPin className="w-6 h-6 text-green-600" />
              <span className="text-xl font-semibold text-green-800">{post.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 pt-6 border-t-2 border-gray-200">
          <button
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-xl font-bold transition-all ${
              isLiked
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-7 h-7 ${isLiked ? 'fill-white' : ''}`} />
            {post.likes}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl text-xl font-bold hover:bg-blue-50 transition-all"
          >
            <MessageCircle className="w-7 h-7" />
            {post.comments?.length || 0}
          </button>
        </div>

        {showComments && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            {user && (
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="flex-1 px-6 py-4 text-xl border-2 border-gray-300 rounded-2xl focus:border-blue-400 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleComment(post.id, commentText);
                      setCommentText('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    handleComment(post.id, commentText);
                    setCommentText('');
                  }}
                  className="px-8 py-4 bg-blue-500 text-white rounded-2xl text-xl font-bold hover:bg-blue-600 transition-all"
                >
                  Enviar
                </button>
              </div>
            )}
            <div className="space-y-4">
              {post.comments?.map(comment => (
                <div key={comment.id} className="flex gap-4 bg-gray-50 p-5 rounded-2xl">
                  <span className="text-3xl">{comment.authorAvatar}</span>
                  <div>
                    <p className="font-bold text-xl text-gray-800">{comment.author}</p>
                    <p className="text-xl text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const FeedView = () => (
    <div className="space-y-6">
      {!user && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl shadow-xl p-12 text-center mb-8 border-4 border-yellow-200 mx-4 md:mx-0">
          <div className="text-6xl mb-6">🌟</div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">¡Bienvenido/a a VIVO!</h2>
          <p className="text-2xl text-gray-600 mb-8">La red social donde los jubilados nunca se aburren</p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-xl"
          >
            Únirse Gratis
          </button>
        </div>
      )}

      {/* CAMBIO: Caja de búsqueda con color */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-xl p-8 mb-8 border-4 border-blue-200 mx-4 md:mx-0">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-blue-400" />
          <input
            type="text"
            placeholder="Buscar eventos, lugares..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-20 pr-6 py-6 text-2xl border-3 border-blue-200 rounded-2xl focus:border-blue-400 focus:outline-none bg-white shadow-inner"
          />
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-4 rounded-2xl text-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-blue-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 md:mx-0">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );

  const ProfileView = () => {
    if (!user) {
      return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl shadow-xl p-12 text-center border-4 border-purple-200 mx-4 md:mx-0">
          <User className="w-32 h-32 mx-auto mb-8 text-purple-400" />
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Inicia sesión</h2>
          <p className="text-2xl text-gray-600 mb-8">Crea una cuenta para ver tu perfil</p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl"
          >
            Crear Cuenta
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6 mx-4 md:mx-0">
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl shadow-xl p-12 border-4 border-purple-200">
          <div className="flex items-center gap-6 mb-8">
            <div className="text-7xl">{user.avatar}</div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-2xl text-gray-600">{userCity}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
            <span className="text-4xl font-bold text-gray-800">{userPoints} puntos</span>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl text-center border-2 border-purple-200">
              <div className="text-4xl font-bold text-purple-600">{userStats.posts}</div>
              <div className="text-xl text-gray-600 mt-2">Publicaciones</div>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center border-2 border-purple-200">
              <div className="text-4xl font-bold text-pink-600">{userStats.eventsAttended}</div>
              <div className="text-xl text-gray-600 mt-2">Eventos</div>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center border-2 border-purple-200">
              <div className="text-4xl font-bold text-indigo-600">{userStats.friends}</div>
              <div className="text-xl text-gray-600 mt-2">Amigos</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-8 py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl text-2xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-xl flex items-center justify-center gap-3"
          >
            <LogOut className="w-7 h-7" />
            Cerrar Sesión
          </button>
        </div>

        {/* CAMBIO: Sección de insignias con color */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl shadow-xl p-12 border-4 border-yellow-200">
          <h3 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
            <Award className="w-10 h-10 text-yellow-600" />
            Insignias
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {badges.map(badge => {
              const earned = userPoints >= badge.points;
              return (
                <div
                  key={badge.name}
                  className={`p-8 rounded-2xl border-3 ${
                    earned
                      ? 'bg-gradient-to-br from-yellow-100 to-amber-200 border-yellow-400 shadow-lg'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{badge.icon}</span>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">{badge.name}</h4>
                      <p className="text-lg text-gray-600">{badge.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-gray-700">{badge.points} puntos</span>
                    {earned && <CheckCircle className="w-8 h-8 text-green-500 fill-green-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CAMBIO: Estadísticas con color */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-xl p-12 border-4 border-green-200">
          <h3 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-green-600" />
            Tu Progreso
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-2xl font-semibold text-gray-700">Nivel de Actividad</span>
                <span className="text-2xl font-bold text-green-600">{Math.min(100, Math.floor((userPoints / 1000) * 100))}%</span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (userPoints / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-orange-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={() => setShowAuth(false)}
            className="p-3 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-8 h-8 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-2xl font-bold mb-3 text-gray-700">Nombre</label>
              <input
                type="text"
                value={authForm.name}
                onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                className="w-full p-5 text-2xl border-3 border-gray-300 rounded-2xl focus:border-orange-400 focus:outline-none"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Email</label>
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-gray-300 rounded-2xl focus:border-orange-400 focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Contraseña</label>
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-gray-300 rounded-2xl focus:border-orange-400 focus:outline-none"
              placeholder="••••••"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Ciudad</label>
                <select
                  value={authForm.city}
                  onChange={(e) => setAuthForm({...authForm, city: e.target.value})}
                  className="w-full p-5 text-2xl border-3 border-gray-300 rounded-2xl focus:border-orange-400 focus:outline-none bg-white"
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

              {/* CAMBIO: Edad opcional */}
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Edad (opcional)</label>
                <input
                  type="number"
                  value={authForm.age}
                  onChange={(e) => setAuthForm({...authForm, age: e.target.value})}
                  className="w-full p-5 text-2xl border-3 border-gray-300 rounded-2xl focus:border-orange-400 focus:outline-none"
                  placeholder="Tu edad"
                />
              </div>
            </>
          )}

          <button
            onClick={handleAuth}
            className="w-full px-8 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-xl"
          >
            {isLogin ? 'Entrar' : 'Crear Cuenta'}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-2xl text-orange-600 hover:text-orange-700 font-semibold"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );

  const NewPostModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-3xl shadow-2xl p-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-orange-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Nueva Publicación</h2>
          <button
            onClick={() => setShowNewPost(false)}
            className="p-3 hover:bg-white/50 rounded-full transition-all"
          >
            <X className="w-8 h-8 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Tipo</label>
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({...newPost, type: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none bg-white shadow-inner"
            >
              <option value="event">Evento</option>
              <option value="place">Lugar</option>
              <option value="companion">Busco Compañía</option>
            </select>
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Título</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none shadow-inner"
              placeholder="Título llamativo"
            />
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Descripción</label>
            <textarea
              value={newPost.description}
              onChange={(e) => setNewPost({...newPost, description: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none h-40 shadow-inner"
              placeholder="Cuéntanos más..."
            />
          </div>

          {newPost.type === 'event' && (
            <>
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Fecha</label>
                <input
                  type="date"
                  value={newPost.date}
                  onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                  className="w-full p-5 text-2xl border-3 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none bg-white shadow-inner"
                />
              </div>
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Hora</label>
                <input
                  type="time"
                  value={newPost.time}
                  onChange={(e) => setNewPost({...newPost, time: e.target.value})}
                  className="w-full p-5 text-2xl border-3 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none bg-white shadow-inner"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Ubicación</label>
            <input
              type="text"
              value={newPost.location}
              onChange={(e) => setNewPost({...newPost, location: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none shadow-inner"
              placeholder="¿Dónde?"
            />
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Categoría</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none bg-white shadow-inner"
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
              className="flex-1 px-8 py-5 bg-gray-200 text-gray-700 rounded-2xl text-2xl font-bold hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleNewPost}
              className="flex-1 px-8 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-xl"
            >
              Publicar 🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-pink-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-2xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-pulse">🌟</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  Hoy Vivo
                </h1>
                <p className="text-lg md:text-xl text-white/90 font-semibold">Nunca dejes de vivir</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden md:flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full">
                  <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                  <span className="text-2xl font-bold text-white">{userPoints}</span>
                </div>
              )}
              {user ? (
                <button className="p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full relative transition-all">
                  <Bell className="w-8 h-8 text-white" />
                  <span className="absolute top-3 right-3 w-4 h-4 bg-yellow-400 rounded-full"></span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-orange-50 transition-all shadow-xl"
                >
                  <LogIn className="w-7 h-7" />
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 pb-32 md:pb-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Desktop only - CON COLOR */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl shadow-xl p-6 sticky top-28 border-4 border-purple-200">
              <nav className="space-y-4">
                <button
                  onClick={() => setCurrentView('feed')}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-2xl font-bold transition-all ${
                    currentView === 'feed'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/70'
                  }`}
                >
                  <Home className="w-7 h-7" />
                  Inicio
                </button>
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-2xl font-bold transition-all ${
                    currentView === 'profile'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/70'
                  }`}
                >
                  <User className="w-7 h-7" />
                  Mi Perfil
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-2xl font-bold transition-all ${
                    currentView === 'calendar'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/70'
                  }`}
                >
                  <Calendar className="w-7 h-7" />
                  Mi Agenda
                </button>
              </nav>

              {user && (
                <div className="mt-8 pt-8 border-t-2 border-purple-200">
                  <p className="text-xl text-gray-600 mb-4 font-semibold">Tu ciudad:</p>
                  <select
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    className="w-full p-4 text-xl border-3 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none bg-white"
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

          {/* Content area */}
          <div className="md:col-span-2">
            {currentView === 'feed' && <FeedView />}
            {currentView === 'profile' && <ProfileView />}
            {currentView === 'calendar' && (
              <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-3xl shadow-xl p-12 text-center border-4 border-green-200 mx-4 md:mx-0">
                <Calendar className="w-32 h-32 mx-auto mb-8 text-green-500" />
                <h2 className="text-4xl font-bold mb-4 text-gray-800">Mi Agenda</h2>
                <p className="text-2xl text-gray-600">Próximamente: Calendario personalizado con todos tus eventos</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Botón flotante para crear publicación */}
      {user && (
        <button
          onClick={() => setShowNewPost(true)}
          className="fixed bottom-32 md:bottom-10 right-6 md:right-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-8 md:p-10 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-30 animate-bounce border-4 border-white"
        >
          <Plus className="w-12 h-12 md:w-14 md:h-14" />
        </button>
      )}

      {/* Menú inferior - Mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-4 py-5 z-40 shadow-2xl border-t-4 border-orange-600">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setCurrentView('feed')}
            className={`flex flex-col items-center gap-2 ${
              currentView === 'feed' ? 'text-white scale-110' : 'text-white/70'
            }`}
          >
            <Home className="w-10 h-10 drop-shadow-lg" />
            <span className="text-base font-bold drop-shadow">Inicio</span>
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex flex-col items-center gap-2 ${
              currentView === 'calendar' ? 'text-white scale-110' : 'text-white/70'
            }`}
          >
            <Calendar className="w-10 h-10 drop-shadow-lg" />
            <span className="text-base font-bold drop-shadow">Agenda</span>
          </button>
          {user && (
            <button
              onClick={() => setShowNewPost(true)}
              className="flex flex-col items-center gap-2"
            >
              <div className="bg-yellow-400 text-orange-600 p-5 rounded-full -mt-12 shadow-2xl border-4 border-white animate-pulse">
                <Plus className="w-10 h-10" />
              </div>
              <span className="text-base font-bold text-white drop-shadow">Publicar</span>
            </button>
          )}
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center gap-2 ${
              currentView === 'profile' ? 'text-white scale-110' : 'text-white/70'
            }`}
          >
            <User className="w-10 h-10 drop-shadow-lg" />
            <span className="text-base font-bold drop-shadow">Perfil</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showNewPost && <NewPostModal />}
      {showAuth && <AuthModal />}
    </div>
  );
}

export default App;
