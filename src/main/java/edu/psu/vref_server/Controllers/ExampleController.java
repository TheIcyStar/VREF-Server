package edu.psu.vref_server.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExampleController {

    @GetMapping("/apitest-alt")
    String getTest(){
        return "Goodbye World";
    }

    @GetMapping("/apitest")
    String getTest(){
        return "Hello World";
    }
}
