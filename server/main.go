package main

import (
	"github.com/julienschmidt/httprouter"
	"google.golang.org/appengine"
	"eight_puzzle_solver"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"
	// "log"
	"io"
)

func init() {
	r := httprouter.New()

	r.POST("/api/eight_puzzle_solver", Eight_Puzzle_Solver)
	r.GET("/api/eight_puzzle_solver/generate_random", Eight_Puzzle_Solver_GEN_Random)

	http.Handle("/", r)
	
	appengine.Main()
	
}

func Eight_Puzzle_Solver(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	// log.Println("started")	
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        panic(err)
	}
	
    var p struct{
		Algorithm int
		State [3][3]int
	}

    err = json.Unmarshal(body, &p)
    if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var moves string
	var cost int
	var expanded int
	var tm time.Duration

	switch p.Algorithm {
	case 0:
		moves, cost, expanded, tm = eight_puzzle_solver.BreadthFirstSearch(p.State)
	break;
	case 1:
		moves, cost, expanded, tm = eight_puzzle_solver.GreedyBestFirstSearchManhattan(p.State)		
	break;
	case 2:
		moves, cost, expanded, tm = eight_puzzle_solver.GreedyBestFirstSearchMisplaced(p.State)		
	break;		
	case 3:
		moves, cost, expanded, tm = eight_puzzle_solver.AStarSearchManhattan(p.State)		
	break;		
	case 4:
		moves, cost, expanded, tm = eight_puzzle_solver.AStarSearchMisplaced(p.State)
	break;		
	case 5:
		moves, cost, expanded, tm = eight_puzzle_solver.IDaStarSearchManhattan(p.State)		
	break;		
	case 6:
		moves, cost, expanded, tm = eight_puzzle_solver.IDaStarSearchMisplaced(p.State)		
	break;	
	default:
		http.Error(w, "Please select algorithm from the given list", http.StatusBadRequest)		
		return		
	}
	
	var s struct{
		Moves string 		`json:"moves"`
		Cost int 			`json:"cost"`
		Expanded int 		`json:"expanded"`
		Time float64	 	`json:"time"`
	}
	
	s.Moves = moves
	s.Cost = cost
	s.Expanded = expanded
	s.Time = tm.Seconds()

	bs, err := json.Marshal(s)
    if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)		
		return
	}

	io.WriteString(w, string(bs))
	// log.Println("done")	
}

func Eight_Puzzle_Solver_GEN_Random(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	// log.Println("started")	
	s := eight_puzzle_solver.RandomPuzzle()
	bs, err := json.Marshal(s)
    if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)		
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.WriteString(w, string(bs))
	// log.Println("done")	
}