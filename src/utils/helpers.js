export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving"
) {
  if (isLoading) {
    btn.textcontent = loadingText;
  } else {
    btn.textcontent = defaultText;
  }
}
