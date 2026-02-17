# **Weather Widget**

A small, **responsive weather widget** built with plain HTML, SCSS, and JavaScript.

## **Overview**

- **Purpose:** A lightweight widget to display current weather information and icons. Ideal for embedding into simple web pages or as a starter project for learning CSS/SCSS and vanilla JS.
- **Tech:** HTML, SCSS (compiled to CSS), JavaScript. No frameworks or build tools required.

## **Features**

- **Responsive layout**
- **SCSS-based styling** with variables and mixins
- **Simple, extensible JavaScript** for fetching/updating data or using static data

## **Demo**

[View the live app](https://weatherwidgetsimpljs.netlify.app/)

## **Installation / Run Locally**

No build system required. Two simple options:

- Open `index.html` directly in your browser
- Run a lightweight static server (recommended for fetching assets):
  - **Using Python 3:**

    ```bash
    python -m http.server 8000
    ```

  - **Using npm `http-server`:**

    ```bash
    npx http-server -c-1 . -p 8000
    ```

Visit `http://localhost:8000`.

## **Building SCSS**

If you want to recompile SCSS to CSS, install **Sass (Dart Sass)** and run:

```bash
sass scss/style.scss css/style.css --no-source-map --style=expanded
```

Adjust input/output paths as needed.

## **Project Structure**

- `index.html` — main page
- `css/style.css` — compiled stylesheet
- `scss/` — source SCSS files (`_variables.scss`, `_mixins.scss`, `_reset.scss`, `style.scss`)
- `js/script.js` — widget JavaScript
- `img/` — images and icons

## **Customization**

- Edit SCSS variables in `scss/_variables.scss` to change **colors, spacing, or typography**
- Update `js/script.js` to change **logic, fetch real API data**, or modify displayed fields
