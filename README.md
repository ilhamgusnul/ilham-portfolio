# Ilham Gusnul Romadhon - Portfolio Website

A modern, responsive portfolio website built with Vite, Vanilla JavaScript, and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Scrolling**: Navigation with smooth scroll behavior
- **Project Filtering**: Interactive portfolio filtering by category
- **Contact Form**: Functional contact form with validation
- **Animations**: Smooth animations and hover effects
- **Modern UI**: Clean, professional design with orange accent color

## 🛠️ Technologies Used

- **Vite** - Fast build tool and development server
- **Vanilla JavaScript** - Pure JavaScript for interactivity
- **Tailwind CSS** - Utility-first CSS framework
- **Google Fonts** - Poppins font family
- **PostCSS** - CSS processing

## 📁 Project Structure

```
portfolio-vite-vanilla/
├── index.html              # Main HTML file
├── src/
│   ├── main.js            # JavaScript functionality
│   └── style.css          # Custom styles
├── public/
│   ├── favicon.svg        # IGR favicon (32x32)
│   ├── favicon-64.svg     # IGR favicon (64x64)
│   └── images/
│       └── profile-picture.png  # Profile image
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Project dependencies
```

## 🎨 Design Features

### Color Scheme

- **Primary Orange**: #FF6B00
- **Black**: #000000
- **White**: #FFFFFF
- **Gray**: Various shades for text and backgrounds

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Branding

- **Favicon**: Custom "IGR" favicon with orange gradient
- **Logo**: "Ilham Gusnul" text in navbar

## 📱 Sections

1. **Navbar** - Sticky navigation with logo and menu
2. **Hero Section** - Introduction with profile image and stats
3. **Services** - Three service cards (Web, Mobile, UI/UX)
4. **Skills** - Four skill cards with progress bars
5. **Projects** - Portfolio with filtering functionality
6. **CTA Section** - Call-to-action for collaboration
7. **Contact** - Contact form and information
8. **Footer** - Social links and copyright

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd portfolio-vite-vanilla
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔧 Customization

### Colors

Update the color scheme in `tailwind.config.js`:

```javascript
colors: {
  'orange': '#FF6B00',
  'orange-600': '#e55a00',
  'orange-400': '#FF8533',
}
```

### Content

- Update personal information in `index.html`
- Replace profile image in `public/images/`
- Modify project data in the projects section
- Update contact information

### Styling

- Custom styles are in `src/style.css`
- Tailwind utilities are used throughout the HTML
- Animations are defined in both CSS and JavaScript

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 JavaScript Features

- **Smooth Scrolling**: Navigation links scroll smoothly to sections
- **Project Filtering**: Filter projects by category (Web, Mobile, Design)
- **Form Validation**: Contact form with email validation
- **Scroll Effects**: Navbar shadow on scroll
- **Animations**: Intersection Observer for scroll animations
- **Back to Top**: Floating back-to-top button

## 📝 Form Handling

The contact form includes:

- Name validation (required)
- Email validation (format check)
- Message validation (required)
- Success message on submission

## 🔍 SEO & Performance

- Semantic HTML structure
- Optimized images
- Fast loading with Vite
- Mobile-friendly design
- Accessible navigation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Ilham Gusnul Romadhon**

- Full Stack Developer
- UI/UX Designer
- Contact: ilhamgusnul@gmail.com

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using Vite, Vanilla JavaScript, and Tailwind CSS
