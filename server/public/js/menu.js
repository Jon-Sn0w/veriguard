// Menu configuration
const menuItems = [
    { name: "Home", path: "/" },
    { name: "Add NFT", path: "/addnft" },
    { name: "Remove NFT", path: "/removenft" },
    { name: "Role Registry By Count", path: "/registerrole" },
    { name: "Value Based Role Registry", path: "/registervaluerole" },
    { name: "Royalties", path: "/royaltyCollections" },
    { name: "User Guide", path: "/userGuide" },
    { name: "Add Bot to Discord", path: "https://discord.com/oauth2/authorize?client_id=1211054291486253116", external: true }
];

console.log("menu.js is loaded and executing"); // Initial load confirmation

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, initializing menu");

    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);

    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    console.log("Found dropdown menus:", dropdownMenus.length);

    if (dropdownMenus.length === 0) {
        console.error("No elements with class 'dropdown-menu' found");
        return;
    }

    dropdownMenus.forEach((menu, index) => {
        console.log(`Processing dropdown menu ${index + 1}`);

        // Populate menu items
        menu.innerHTML = '';
        menuItems.forEach((item, idx) => {
            if (item.path === currentPath) {
                console.log(`Skipping ${item.name} as it matches current path`);
                return;
            }

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.path;
            a.textContent = item.name;
            a.className = `block whitespace-no-wrap py-2 px-4 bg-gray-200 hover:bg-gray-400 ${
                idx === 0 ? 'rounded-t' : ''
            } ${item.external ? 'bg-blue-100 hover:bg-blue-200' : ''}`;
            if (item.external) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            li.appendChild(a);
            menu.appendChild(li);
        });

        // Find the button
        const button = menu.previousElementSibling;
        if (!button) {
            console.error(`No button found before dropdown menu ${index + 1}`);
            return;
        }

        console.log("Menu button element:", button);

        // Add click event
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("Menu button clicked");
            console.log("Before toggle - Menu classes:", menu.classList.toString());
            menu.classList.toggle('hidden');
            console.log("After toggle - Menu classes:", menu.classList.toString());
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!button.contains(e.target) && !menu.contains(e.target)) {
                console.log("Clicked outside, hiding menu");
                menu.classList.add('hidden');
            }
        });
    });
});
