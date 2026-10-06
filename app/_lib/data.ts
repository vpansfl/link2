export type Folder = {
  id: string;
  name: string;
  // 주인이 없는 기본 폴더: 모두에게 보이고, 수정·삭제할 수 없음
  shared: boolean;
};

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string;
  folderId?: string;
};

export const FOLDER_NAME_MAX_LENGTH = 20;

export function filterByFolder(
  bookmarks: Bookmark[],
  folderId?: string,
): Bookmark[] {
  if (!folderId) return bookmarks;
  return bookmarks.filter((bookmark) => bookmark.folderId === folderId);
}

export function validateBookmarkUrl(url: string): string | null {
  const error = "http:// 또는 https://로 시작하는 주소를 입력해 주세요.";
  if (!URL.canParse(url)) return error;
  const { protocol } = new URL(url);
  return protocol === "http:" || protocol === "https:" ? null : error;
}

export function validateFolderName(
  name: string,
  folders: Folder[],
): string | null {
  if (!name) return "폴더 이름을 입력해 주세요.";
  if (name.length > FOLDER_NAME_MAX_LENGTH) {
    return `폴더 이름은 ${FOLDER_NAME_MAX_LENGTH}자 이하로 입력해 주세요.`;
  }
  if (folders.some((folder) => folder.name === name)) {
    return "이미 있는 폴더 이름입니다.";
  }
  return null;
}
