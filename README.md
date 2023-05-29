# HSR Achievement Tracker

Unofficial achievement tracker for Honkai: Star Rail.

## Technology Stack

This project is built using:

- [Remix](https://remix.run/)
- [TailwindCSS](https://tailwindcss.com/)
- [PlanetScale](https://www.planetscale.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## Contributing

Contributions are welcome! If you find an issue with the app, please [open an issue on GitHub](https://github.com/jodygeraldo/hsr-achievement-tracker/issues). If you want to fix a typo or make other small changes, you can edit the [data file](/app/data/achievement.server.ts) and submit a pull request to the `main` branch. There will be a preview page that you can see before your changes are merged.

> Please note that you will need to set up [PlanetScale](https://www.planetscale.com/) in order to run the development server.

## Development

1. Install dependencies

   ```sh
   npm install
   ```

2. Set up a database with PlanetScale.

3. Create the database table using the schema provided in the schema.sql file.

   ```sql
    CREATE TABLE `achievement` (
   	`id` int unsigned NOT NULL AUTO_INCREMENT,
   	`session_id` varchar(255) NOT NULL,
   	`name` varchar(255) NOT NULL,
   	`category` varchar(255) NOT NULL,
   	`path` varchar(255),
   	`created_at` timestamp NULL DEFAULT current_timestamp(),
   	PRIMARY KEY (`id`),
   	UNIQUE KEY `session_id` (`session_id`, `name`, `category`)
   ) ENGINE InnoDB,
   CHARSET utf8mb4,
   COLLATE utf8mb4_0900_ai_ci;
   ```

4. Copy the .dev.vars.example file to .dev.vars

   ```sh
   cp .dev.vars.example .dev.vars
   ```

5. Populate the .dev.vars

6. Run the development server.

   ```sh
   npm run dev
   ```

> Development requires an internet connection because it needs to connect to PlanetScale.
> Setting up an offline environment may be difficult due to the nature of PlanetScale and Cloudflare workers.
> I am considering using Cloudflare D1 instead of PlanetScale to resolve development problems.

## License

This project is licensed under the [Unlicense license](https://unlicense.org/). This is a fan-made project and is not associated with HoYoverse. All game content and materials are property of COGNOSPHERE.
