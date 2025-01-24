type PermissionOptions_ = {
  readonly mode: "readwrite";
};

type FileSystemHandle_ = FileSystemDirectoryHandle | FileSystemFileHandle;

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle
interface FileSystemDirectoryHandle {
  readonly values: () => FileSystemHandle_[];
  readonly queryPermission: (
    options: PermissionOptions_
  ) => Promise<"granted" | "prompt" | unknown>;
  readonly requestPermission: (
    options: PermissionOptions_
  ) => Promise<"granted" | unknown>;
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
interface FileSystemFileHandle {
  // already available in chrome
  // https://github.com/whatwg/fs/pull/10#issuecomment-1385992738
  readonly move: (newName: string) => Promise<void>;
}

// https://wicg.github.io/file-system-access/#enumdef-wellknowndirectory
type WellKnownDirectory =
  | "desktop"
  | "documents"
  | "downloads"
  | "music"
  | "pictures"
  | "videos";

// https://wicg.github.io/file-system-access/#api-filepickeroptions-starting-directory
// https://wicg.github.io/file-system-access/#api-showdirectorypicker
type StartingDirectory = {
  readonly id?: string; // If id’s length is more than 32, throw a TypeError.
  readonly startIn?: FileSystemHandle | WellKnownDirectory;
};

type FilePickerOptionsType = {
  readonly description?: string;
  readonly accept: Record<string, ReadonlyArray<string>>;
};

// https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker
type SaveFilePickerOptions = {
  readonly excludeAcceptAllOption?: boolean;

  // https://github.com/WICG/file-system-access/blob/main/SuggestedNameAndDir.md
  readonly startIn?:
    | "desktop"
    | "documents"
    | "downloads"
    | "music"
    | "pictures"
    | "videos";

  // https://github.com/WICG/file-system-access/blob/main/SuggestedNameAndDir.md#interaction-of-suggestedname-and-accepted-file-types
  readonly suggestedName?: string;

  readonly types?: FilePickerOptionsType[];
};

// https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
// https://wicg.github.io/file-system-access/#api-filepickeroptions
type OpenFilePickerOptions = StartingDirectory & {
  readonly multiple?: boolean;
  readonly excludeAcceptAllOption?: boolean;
  readonly types?: FilePickerOptionsType[];
};

const showOpenFilePicker: (
  options?: OpenFilePickerOptions
) => Promise<(FileSystemFileHandle | FileSystemDirectoryHandle)[]>;
const showDirectoryPicker: (
  options?: StartingDirectory
) => Promise<FileSystemDirectoryHandle>;
const showSaveFilePicker: (
  options?: SaveFilePickerOptions
) => Promise<FileSystemFileHandle>;

interface DataTransferItem {
  getAsFileSystemHandle(): Promise<FileSystemHandle_>;
}
