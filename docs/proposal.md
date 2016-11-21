## Distraction Blocker
### Background

Social media and other distracting websites can make it difficult to focus and work.
This extension will allow users to set an amount of time that they would like to focus for, and the the extension will block access to sites that have been added to the block list.

The extension will also provide links to resources that can be useful for focusing, such as websites that provide relaxing background music.

### Functionality & MVP

With this extension, users will be able to:

- [ ] Set an amount of time to focus for,
- [ ] Add URLs to the block list,
- [ ] Remove URLs from the block list,
- [ ] Navigate to links conducive to focusing,
- [ ] Input a tedious sequence of keys if they would like to end the focus session early.

### Wireframes

![wireframes](https://github.com/scandycuz/flex-project/docs/blocked-sites-wireframe.png)

### Technologies & Technical Challenges

This extension will be implemented using the standard Chrome extension technology: Javascript, HTML, and CSS.  In addition to the `manifest.json` and `package.json` files, there will be two scripts:

- `content.js`: will contain the logic for restricting site access
- `options.js`: will contain the logic for changing the user's settings (adding and removing blocked sites, and adding and removing focus aid resources)

There will also be two HTML files and one CSS file to display the content:

- `dropdown.html`: the file that renders the dropdown allowing users to start a session
- `options.html`: the file that renders the Settings menu for the user
- `style.css`: the file containing the styling for the Extension dropdown and Settings menu

The primary technical challenges will be:

- Identifying and blocking requests to blocked sites
- Creating the interactivity that allows users to add and remove sites and focus aid resources
- Implementing the interactive element that allows people to end the focus session early

Requests to the blocked sites will be made using HTTP requests. The plugin will be able to detect when outgoing http requests are being made to a site on the block list, block the site, and then alert the user that it has been blocked. The algorithm that conducts the blocking will also have to be written to ensure that it only blocks requests to the correct sites, and not, for example, a link to an article that happens to have the word 'Facebook' in the title.

### Implementation Timeline

**Day 1**: Get started on the infrastructure of the extension, following <a href="https://developer.chrome.com/extensions/getstarted">this guide</a> from Chrome.  By the end of the day, I will have:

- A completed `package.json`
- A completed `manifest.json`
- The ability to locate and block an HTTP request containing a keyword

**Day 2**: Work on improving the algorithm so that it blocks the sites correctly, and create an interface that allows users to add and remove sites from the block list:

- A well written algorithm that blocks requests correctly
- A roughly styled interface to add and remove blocked sites

**Day 3**: Add the ability to add and remove focus aid resource links to a list, create the interactive sequence that allows users to end a session early.

- A rougly styled interface to add and remove focus aid resources, and navigate to them
- A rough interactive element that allows users to type in a tedious string of text to end the session early

**Day 4**: Fully style the plugin UI elements so that it is simple and intuitive to use, and looks great:

- A fully implemented and well styled plugin
