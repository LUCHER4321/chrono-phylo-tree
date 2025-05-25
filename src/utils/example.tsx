import { Species } from "../classes/Species";

export const example  = Species.fromJSON({
    name: "Hominoidea",
    apparition: -25e6,
    duration: 6e6,
    descendants: [
        {
            name: "Hilobates",
            afterApparition: 6e6,
            duration: 19e6,
            image: "https://upload.wikimedia.org/wikipedia/commons/4/40/Hylobaes_lar_Canarias.jpg"
        },
        {
            name: "Hominidae",
            afterApparition: 6e6,
            duration: 6e6,
            descendants: [
                {
                    name: "Pongo",
                    afterApparition: 6e6,
                    duration: 13e6,
                    image: "https://upload.wikimedia.org/wikipedia/commons/6/65/Pongo_tapanuliensis.jpg"
                },
                {
                    name: "Homininae",
                    afterApparition: 6e6,
                    duration: 5e6,
                    descendants: [
                        {
                            name: "Gorilla",
                            afterApparition: 5e6,
                            duration: 8e6,
                            image: "https://gorillas-world.com/wp-content/uploads/anatomia.jpg"
                        },
                        {
                            name: "Hominini",
                            afterApparition: 5e6,
                            duration: 2e6,
                            descendants: [
                                {
                                    name: "Pan",
                                    afterApparition: 2e6,
                                    duration: 3e6,
                                    descendants: [
                                        {
                                            name: "Pan Troglodytes",
                                            afterApparition: 3e6,
                                            duration: 3e6,
                                            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR-v4-d4R9AUgsHdG42VPYuYj_d4OMRHKasUQ&s"
                                        },
                                        {
                                            name:"Pan Paniscus",
                                            afterApparition : 3e6,
                                            duration : 3e6,
                                            image : "https://upload.wikimedia.org/wikipedia/commons/e/e2/Apeldoorn_Apenheul_zoo_Bonobo.jpg"
                                        }
                                    ],
                                },
                                {
                                    name: "Homo",
                                    afterApparition: 2e6,
                                    duration: 6e6,
                                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7XK_e3HG0jhOticytH1Dn3tzBEZyRyWc5Mg&s"
                                }
                            ],
                        }
                    ],
                }
            ]
        }
    ]
});