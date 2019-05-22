import { CompositeSchemaEntryWalker } from "../../lib/entry/";

const create = (opts, config) => new CompositeSchemaEntryWalker(opts, config);

describe("CompositeSchemaEntryWalker", () => {
  const opts = {};
  const config = {};
  describe("create", () => {
    // constructor(opts: any = {}, config: any = {}) {
    //   super(config);
    //   this.opts = opts;
    //   this.listeners = config.listeners;
    //   this.schemaTypeResolver = new SchemaTypeResolver(opts, config);
    //   const createChildEntryWalker = config.createChildEntryWalker;
    //   this.childEntryWalker = createChildEntryWalker({ entryWalker: this });
    // }

    // _entry: any;
    // config: any;
    // opts: any;
    // listeners: any[];
    // wasCacheHit: boolean = false;
    // key: string = "";
    // schemaTypeResolver: any;
    // childEntryWalker: any;
    // schema: any;
    // type: any;
    // referenceEntry: any; // resolved from $ref

    test("creates instance", () => {
      expect(create(opts, config)).toBeDefined();
    });
  });

  describe("instance", () => {
    const opts = {};
    const onEnter = (entry: any) => console.log("ENTER", entry);
    const onExit = (entry: any) => console.log("EXIT", entry);

    const config = {
      onEnter,
      onExit
    };
    const walker = create(opts, config);
    const entry = {
      key: "name",
      type: "string"
    };

    describe("walkEntry", () => {
      // walkEntry(entry: any) {
      //   this.onEnterEntry(entry);
      //   this.entry = entry;
      //   const result = this.walk(entry);
      //   this.walkChildEntries();
      //   this.onExitEntry(entry, result);
      // }

      const result = walker.walkEntry(entry);
      test("result", () => {
        expect(result).toBeDefined();
      });

      test("onEnter", () => {
        expect(result).toBeDefined();
      });

      test("onExit", () => {
        expect(result).toBeDefined();
      });
    });

    describe("walkChildEntries", () => {
      // walkChildEntries() {
      //   return this.children.map(this.walkChildEntry);
      // }
    });

    describe("walkChildEntry", () => {
      // walkChildEntry(entry: any) {
      //   this.childEntryWalker.walkChildEntry(entry);
      // }
    });

    describe("children", () => {
      // get children() {
      //   return [];
      // }
    });

    describe("walk", () => {
      // walk(entry: any): any {
      //   return entry;
      // }
    });

    describe("onEnterEntry", () => {
      // onEnterEntry(entry: any) {
      //   this.genericOnEntry({ lifecycle: "Enter", entry });
      // }
    });

    describe("onExitEntry", () => {
      // onExitEntry(entry: any, result: any) {
      //   this.genericOnEntry({ lifecycle: "Exit", entry, result });
      // }
    });

    describe("genericOnEntry", () => {
      // genericOnEntry(opts: any = {}) {
      //   let { lifecycle, entry, result } = opts;
      //   lifecycle = lifecycle || "Enter";
      //   const { type } = entry;
      //   const methodName = this.methodName(type, lifecycle);
      //   this.listeners.map(listener => {
      //     const eventHandler = listener[methodName];
      //     eventHandler(entry, result);
      //   });
      // }
    });

    describe("methodName", () => {
      // methodName(type: string, lifecycle: string) {
      //   type = classify(type);
      //   return `on${lifecycle}${type}`;
      // }
    });
  });
});
