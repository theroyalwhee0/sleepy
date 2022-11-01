package main

// Trivial implementation of Sleepy in Go.
// This implementation does close-to-no error checking.

import (
    "math"
    "time"
    "fmt"
    "strings"
    "regexp"
    "encoding/json"
)

func trivialSleepy(input string, evaluator func(command string, args []interface{}, state map[string]interface{}) error) (map[string]interface{}, error) {
    // Parse & compile.
    sleepy_version := []int{0, 0, 1}
    var compiled [][]interface{}
    compiled = append(compiled, []interface{}{"@begin", sleepy_version})
    for _, item := range strings.Split(input, "\n") {
        matched, err := regexp.MatchString(`^\s*(#|$)`, item)
        if err != nil {
            return nil, err
        }
        if ! matched {
            trimmed := strings.TrimSuffix(item, ",")
            var data []interface{}
            err := json.Unmarshal([]byte(trimmed), &data)
            if err != nil {
                return nil, err
            }
            if len(data) == 0 || data[0] == "@noop" {
                continue;
            }
            compiled = append(compiled, data)
        }
    }
    compiled = append(compiled, []interface{}{"@end"})
    // Evaluate.
    state := map[string]interface{}{}
    for _, item := range compiled {
        first := item[0].(string)
        rest := item[1:]
        ch := first[0:1]
        if ch == "@" {
            if first == "@set" {
                state[rest[0].(string)] = rest[1]
            }
        } else if ch == "$" {
            state[strings.TrimPrefix(first, "$")] = rest[0]
        } else {
            err := evaluator(first, rest, state)
            if err != nil {
                return nil, err
            }
        }
    }
    return state, nil
}

// ---------------------------------------------------------------------

func main() {
    const input = ` # This is a comment.

                    [],
                    ["@noop"],
                    ["@set", "name", "Bob Smith"]
                    ["$counter", 0]
                    ["add"]
                    ["print", "Hello World!"]
                    ["sleep", 1000]
                    ["print-state", "counter"]
                    ["add", 2]
                    ["print-state", "counter"]
                    ["raise", 2]
                    ["print-state", "counter"]
                    ["print-state", "name"]
                    ["print", "Goodbye."]
    `;
    evaluator := func (command string, args []interface{}, state map[string]interface{}) error {
        switch command {
            case "sleep": {
                ms := args[0].(float64)
                time.Sleep(time.Duration(ms) * time.Millisecond)
            }
            case "print": {
                fmt.Printf("> ")
                for _, arg := range args {
                    fmt.Printf("%s ", arg)
                }
                fmt.Printf("\n")
            }
            case "print-state": {
                key := args[0].(string)
                bytes, err := json.Marshal(state[key])
                if err != nil {
                    return err
                }
                serialized := strings.Trim(string(bytes), "\"")
                _, err = fmt.Printf("> State '%s' = '%s'\n", key, serialized)
                if err != nil {
                    return err
                }
            }
            case "add": {
                previous := state["counter"].(float64)
                var value float64 = 1
                if(len(args) > 0) {
                    value = args[0].(float64)
                }
                state["counter"] = previous + value
            } 
            case "raise": {
                previous := state["counter"].(float64)
                if(len(args) > 0) {
                    state["counter"] = math.Pow(previous, args[0].(float64))
                }
            }                                
            default: {
                return fmt.Errorf("Runtime Error: Unrecognized command '%s'", command)
            }
        }
        return nil
    }    
    state, err := trivialSleepy(input, evaluator)
    if err != nil {
        panic(err)
    } else {
        serialized, err := json.Marshal(state)
        if err != nil {
            panic(err)
        }
        fmt.Printf("> State = %s\n", serialized)
    }
}