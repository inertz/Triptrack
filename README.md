# TripTrack 🗺️

A smart vacation itinerary planner built with React Native and Expo. Organize your trips day by day with multimedia attachments, reminders, and offline capability.

![TripTrack Banner](https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🗺️ Core Features
- **Multi-Day Trip Planning**: Create and organize trips with multiple days
- **Activity Management**: Add activities with time, location, and detailed descriptions
- **Media Attachments**: Attach photos, videos, and notes to each activity
- **Gallery Viewer**: View media in an elegant gallery-style modal
- **Camera Integration**: Capture photos and videos directly from the app
- **Smart Reminders**: Set local push notifications for activities
- **Offline First**: Full functionality without internet connection
- **Export & Share**: Export itineraries to PDF or JSON format

### 📱 User Experience
- **Clean UI**: Modern card-based design with smooth animations
- **Timeline View**: Visual timeline for easy trip browsing
- **Calendar Integration**: Calendar-style view for date-based planning
- **Dark/Light Theme**: Automatic theme switching based on system preference
- **Responsive Design**: Optimized for all mobile screen sizes
- **Intuitive Navigation**: Tab-based navigation with clear visual hierarchy

### 💾 Data & Storage
- **Local Storage**: AsyncStorage for offline data persistence
- **Media Management**: Efficient media storage and retrieval
- **Data Export**: Share itineraries in multiple formats
- **Backup Ready**: Easy data migration and backup capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/triptrack.git
   cd triptrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 📱 Usage Guide

### Creating Your First Trip

1. **Open TripTrack** and tap the "+" button on the home screen
2. **Enter trip details**: Name, destination, start and end dates
3. **Add your first day** by tapping "Add Day" in your trip
4. **Create activities** for each day with time, location, and description
5. **Attach media** by tapping the camera icon on any activity
6. **Set reminders** to get notified before important activities

### Managing Activities

- **Edit**: Tap any activity card to modify details
- **Media**: Add photos, videos, or notes to remember special moments
- **Reminders**: Set notifications to never miss an activity
- **Completion**: Mark activities as completed to track progress

### Viewing Your Trips

- **Timeline View**: See all activities in chronological order
- **Calendar View**: Browse trips by date in calendar format
- **Media Gallery**: View all trip photos and videos in one place

## 🏗️ Architecture

### Project Structure
```
triptrack/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── trip/              # Trip detail screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── context/              # React Context providers
├── services/             # Business logic services
├── types/                # TypeScript type definitions
└── constants/            # App constants and themes
```

### Key Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type safety and better developer experience
- **Expo Router**: File-based navigation system
- **AsyncStorage**: Local data persistence
- **Expo Notifications**: Local push notifications
- **Expo MediaLibrary**: Media access and management
- **Expo ImagePicker**: Camera and gallery integration

### Data Flow
1. **Context Provider**: Manages global app state
2. **Storage Service**: Handles data persistence with AsyncStorage
3. **Notification Service**: Manages local push notifications
4. **Media Service**: Handles photo/video operations
5. **Components**: Consume context and services for UI updates

## 🎨 Design System

### Color Palette
- **Primary**: #007AFF (iOS Blue)
- **Success**: #34C759 (Green)
- **Warning**: #FF9500 (Orange)
- **Error**: #FF3B30 (Red)
- **Background**: Dynamic (Light/Dark theme)

### Typography
- **Headers**: System font, bold weights
- **Body**: System font, regular weight
- **Captions**: System font, light weight

### Spacing
- **Base unit**: 8px grid system
- **Margins**: 16px, 24px, 32px
- **Padding**: 8px, 16px, 24px

## 🔧 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web (limited functionality)
npm run build      # Build for production
```

### Adding New Features

1. **Create types** in `types/` directory
2. **Add services** in `services/` for business logic
3. **Build components** in `components/` directory
4. **Create screens** in `app/` directory
5. **Update context** if global state changes needed

### Testing
```bash
npm test           # Run unit tests
npm run test:e2e   # Run end-to-end tests
```

## 📦 Building for Production

### iOS Build
```bash
expo build:ios
```

### Android Build
```bash
expo build:android
```

### App Store Deployment
1. Build production version
2. Test on physical devices
3. Submit to App Store/Play Store
4. Follow platform-specific guidelines

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues**
```bash
npx expo start --clear
```

**iOS simulator not opening**
```bash
npx expo run:ios
```

**Android build failures**
```bash
cd android && ./gradlew clean && cd ..
npx expo run:android
```

**Permission issues**
- Ensure camera and media permissions are granted
- Check notification permissions in device settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for continuous improvements
- **Contributors** who help make TripTrack better
- **Pexels** for providing beautiful stock photos

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/triptrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/triptrack/discussions)
- **Email**: support@triptrack.app

---

**Made with ❤️ for travelers worldwide**

*TripTrack - Your smart companion for unforgettable journeys*