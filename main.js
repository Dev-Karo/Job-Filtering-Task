// Class names used to style and control the page
const ACTIVE = "tag-on"; // When a tag is selected
const HIDDEN = "bar-hidden"; // When the filter bar is not visible
const REMOVE = "tag-off"; // Style for tags in the filter bar with a remove button
const TAG = "tag"; // Basic style for all tags

// Creates HTML for a tag with the given style
function getTagHTML(tag, tagClass) {
  return `<span class="${tagClass}">${tag}</span>`;
}

// Adds or removes a class from an element (like turning a tag on/off)
function toggleClass(element, className) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
    return;
  }
  element.classList.add(className);
}

// Gets the list of tags currently in the filter bar
function getBarTags(tagValue, barTagsEl) {
  let tags = Array.from(barTagsEl.children)
    .map((node) => node.innerHTML && node.innerHTML.trim())
    .filter((tag) => !!tag);

  // If the tag is already there, remove it; otherwise, add it
  if (tags.includes(tagValue)) {
    tags = tags.filter((tag) => tag !== tagValue);
  } else {
    tags = [...tags, tagValue];
  }
  return tags;
}

// Shows or hides job items based on selected tags
function setList(selectedTags) {
  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    const tags = Array.from(item.querySelectorAll(".tag")).map((tag) =>
      tag.innerHTML.toLowerCase()
    );
    // Show item if it has all selected tags (or no tags are selected)
    const show =
      !selectedTags.length ||
      selectedTags.every((tag) => tags.includes(tag.toLowerCase()));
    item.style.display = show ? "" : "none";
  });
}

// Shows or hides the filter bar
function showBar(show = false) {
  const bar = document.getElementById("top-bar");
  bar.classList.toggle(HIDDEN, !show);
}

// Updates the filter bar with the selected tags
function setBarTags(barTagsEl, tags) {
  barTagsEl.innerHTML = tags.reduce((acc, tag) => {
    return acc + getTagHTML(tag, REMOVE);
  }, "");
}

// Resets everything to the starting state
function reset(barTagsEl) {
  barTagsEl.innerHTML = ""; // Clear the filter bar
  setList([]); // Show all jobs
  showBar(false); // Hide the filter bar
}

// Listens for clicks on the page
window.addEventListener("click", (event) => {
  const clicked = event.target;
  const text = clicked.innerHTML.trim();
  const barTagsEl = document.getElementById("bar-tags");
  const selectedTags = getBarTags(text, barTagsEl);

  // If "Clear" is clicked or no tags are selected, reset everything
  if (clicked.id === "clear" || !selectedTags.length) {
    reset(barTagsEl);
    return;
  }

  // Only respond to clicks on tags
  if (![TAG, REMOVE].some((c) => clicked.classList.contains(c))) {
    return;
  }

  setBarTags(barTagsEl, selectedTags); // Update filter bar
  toggleClass(clicked, ACTIVE); // Highlight/unhighlight the clicked tag
  showBar(selectedTags.length > 0); // Show filter bar if tags are selected
  setList(selectedTags); // Filter the job list
});

// Show all jobs when the page loads
setList([]);
