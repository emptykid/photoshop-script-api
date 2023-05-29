import {Text, TextAlignment} from "../src/lib/Text";
import {Point} from "../src/lib/Shape";


const t = new Text("Hello World");
t.setTextClickPoint(new Point(100, 100))
t.setSize(30);
t.setAlignment(TextAlignment.Right);
t.paint();